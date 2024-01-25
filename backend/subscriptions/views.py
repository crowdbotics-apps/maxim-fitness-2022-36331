import json
import os

from django.db.models import Q
from django.http import JsonResponse
from maxim_fitness_2022_36331.settings import BASE_DIR
from drf_yasg import openapi
from rest_framework import viewsets, status
from django.conf import settings
from datetime import datetime
# Create your views here.
from djstripe.settings import STRIPE_SECRET_KEY

from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
import djstripe
from djstripe.models import Price

from notification.models import Notification
from .serializers import InternalSubscriptionSerializer, CancelSubscriptionRequestSerializer, PaymentRequestSerializer, \
    ChangeSubscriptionRequestSerializer, PaymentMethodRequestSerializer, \
    UpdatePlanRequestSerializer, CardDetailSerializer
from .models import InternalSubscription, InternalCustomer

from rest_framework.response import Response
import stripe
from djstripe import webhooks
from drf_yasg.utils import swagger_auto_schema
from .api_docs_helper import *


stripe.api_key = STRIPE_SECRET_KEY


class SubscriptionViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    """Return stripe publishable key to the client"""
    @swagger_auto_schema(
        method='POST',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['price_id'],
            properties={
                'price_id': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    title='Subscription Price ID'
                ),
            },

        ),
        # responses=create_subscription_responses()
    )
    @action(detail=False, methods=['post'])
    def create_subscription(self, request):
        internal_customer = InternalCustomer.objects.filter(user=request.user).first()
        if internal_customer:
            customer_id = internal_customer.stripe_id
        else:
            customer = stripe.Customer.create(email=request.user.email)
            customer_id = customer.id
            internal_customer = InternalCustomer.objects.create(user=request.user, stripe_id=customer_id)
            internal_customer.save()
            djstripe.models.Customer.sync_from_stripe_data(customer)

        active_subscriptions = stripe.Subscription.list(status='active', customer=customer_id)

        if active_subscriptions.get('data'):
            return Response('User already has active subscription.', status=status.HTTP_400_BAD_REQUEST)

        try:
            subscription = stripe.Subscription.create(
                customer=customer_id,
                trial_period_days=7,
                items=[
                    {"price": request.data['price_id']},
                ],
            )

        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

        return Response(subscription)

    @swagger_auto_schema(
        method='POST',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['card_holder_name', 'card_number', 'card_exp_month', 'card_exp_year', 'card_cvv', 'default'],
            properties={
                'card_holder_name': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    title='Cardholder Name'
                ),
                'card_number': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    title='Card Number'
                ),
                'card_exp_month': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    title='Card Expiry Month'
                ),
                'card_exp_year': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    title='Card Expiry Year'
                ),
                'card_cvc': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    title='Card CVC'
                ),
                'default': openapi.Schema(
                    type=openapi.TYPE_BOOLEAN,
                    title='Default Card'
                ),
            },

        ),
        # responses=create_subscription_responses()
    )
    @action(detail=False, methods=['post'])
    def create_card(self, request):
        serializer = CardDetailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.data

        try:
            card_token = stripe.Token.create(
                card={
                    "name": data.get("card_holder_name"),
                    "number": data.get("card_number"),
                    "exp_month": data.get("card_exp_month"),
                    "exp_year": data.get("card_exp_year"),
                    "cvc": data.get("card_cvv")
                },
            )
            internal_customer = InternalCustomer.objects.filter(user=request.user).first()
            if internal_customer:
                customer_id = internal_customer.stripe_id
            else:
                customer = stripe.Customer.create(email=request.user.email)
                customer_id = customer.id
                internal_customer = InternalCustomer.objects.create(user=request.user, stripe_id=customer_id)
                internal_customer.save()
                djstripe.models.Customer.sync_from_stripe_data(customer)

            card_data = stripe.Customer.create_source(customer_id, source=card_token['id'])
            if data.get('default'):
                stripe.Customer.modify(customer_id, metadata={"default_source": card_data["id"]})
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={
                'detail': f"Error occurred while creating card. ErrorInfo: {str(e)}"
            })
        else:
            return Response(status=status.HTTP_200_OK, data=card_data)

    @swagger_auto_schema(
        method='POST',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['card_id'],
            properties={
                'card_id': openapi.Schema(type=openapi.TYPE_STRING),
            },

        ),
        responses=pay_subscription_responses()
    )
    @action(detail=False, methods=['POST'])
    def delete_card(self, request):
        data = request.data
        try:
            card_id = data.get('card_id', None)
            internal_customer = InternalCustomer.objects.filter(user=request.user).first()

            if internal_customer:
                customer_id = internal_customer.stripe_id
            else:
                customer = stripe.Customer.create(email=request.user.email)
                customer_id = customer.id
                internal_customer = InternalCustomer.objects.create(user=request.user, stripe_id=customer_id)
                internal_customer.save()
                djstripe.models.Customer.sync_from_stripe_data(customer)

            response = stripe.Customer.delete_source(customer_id, card_id)
            return Response(response)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={
                'detail': f"An error occurred while processing your request. ErrorInfo: {str(e)}"
            })

    @action(detail=False, methods=['GET'])
    def config(self, request, *args, **kwargs):
        data = {
            "publishable_key": settings.STRIPE_LIVE_PUBLISHABLE_KEY if settings.STRIPE_LIVE_MODE
            else settings.STRIPE_TEST_PUBLISHABLE_KEY
        }
        return Response(status=status.HTTP_200_OK, data=data)

    @action(detail=False, methods=['GET'])
    def update_price_lookup_keys(self, request, *args, **kwargs):
        stripe_prices = stripe.Price.list()
        products = stripe.Product.list()
        for product in products:
            djstripe.models.Product.sync_from_stripe_data(product)

        for item in stripe_prices:
            djstripe.models.Price.sync_from_stripe_data(item)

        prices = Price.objects.all()
        lookup_keys_data = []
        for price in prices:
            lookup_key = price.product.name.lower()
            if lookup_key:
                stripe_price = stripe.Price.modify(price.id, lookup_key=lookup_key)
                Price.sync_from_stripe_data(stripe_price)
                lookup_keys_data.append(lookup_key)

        return Response(data={'message': "Lookup keys updated successfully", 'lookup_keys': lookup_keys_data},
                        status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'])
    def all_subscriptions(self, request, *args, **kwargs):
        internal_customer = InternalCustomer.objects.filter(user=request.user).first()
        if internal_customer:
            customer_id = internal_customer.stripe_id
        else:
            customer = stripe.Customer.create(email=request.user.email)
            customer_id = customer.id
            internal_customer = InternalCustomer.objects.create(user=request.user, stripe_id=customer_id)
            internal_customer.save()
            djstripe.models.Customer.sync_from_stripe_data(customer)
        data = stripe.Subscription.list(customer=customer_id)
        return Response(data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'])
    def active_subscriptions(self, request, *args, **kwargs):
        internal_customer = InternalCustomer.objects.filter(user=request.user).first()
        if internal_customer:
            customer_id = internal_customer.stripe_id
        else:
            customer = stripe.Customer.create(email=request.user.email)
            customer_id = customer.id
            internal_customer = InternalCustomer.objects.create(user=request.user, stripe_id=customer_id)
            internal_customer.save()
            djstripe.models.Customer.sync_from_stripe_data(customer)
        data = stripe.Subscription.list(status='active', customer=customer_id)
        return Response(data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'], permission_classes=[AllowAny])
    def plans(self, request, *args, **kwargs):
        # call stripe ap to get the prices for each plan
        prices = []
        for price in stripe.Price.list().get('data', []):
            price['product_details'] = stripe.Product.retrieve(price['product'])
            prices.append(price)
        return Response(status=status.HTTP_200_OK, data=prices)

    @swagger_auto_schema(
        method='POST',
        request_body=UpdatePlanRequestSerializer,
        responses=update_plan_responses()
    )
    @action(detail=False, methods=['POST'], url_path='plans/update')
    def update_plan(self, request):
        data = request.data
        serializer = UpdatePlanRequestSerializer(data=data)
        if serializer.is_valid():
            plan_id = data.get('plan_id')
            product_name = data.get('plan', '')
            currency = data.get('currency', 'usd')
            price_id = data.get('price_id')
            new_price_amount = data.get('new_price_amount')
            interval = data.get('interval', '')
            features = data.get('features', '')
            # fetch the current price to see if the price can be updated
            # create metadata from the features
            count = 1
            metadata = {}
            for item in features.split(','):
                metadata[f'feature{count}'] = item
                count += 1

            try:
                price = djstripe.models.Price.objects.get(id=price_id)
                lookup_key = price.lookup_key

                if new_price_amount != price.unit_amount:
                    # there is change is price so archive the current price and create a new one
                    # archive the old price
                    new_lookup_key_for_old_price = f"{lookup_key}_{str(datetime.now())}"
                    old_price = stripe.Price.modify(price_id, active=False,
                                                    lookup_key=f"{new_lookup_key_for_old_price}")
                    djstripe.models.Price.sync_from_stripe_data(old_price)
                    new_price = stripe.Price.create(
                        unit_amount=new_price_amount,
                        currency=currency.lower(),
                        recurring={"interval": interval.lower()},
                        product=plan_id,
                        lookup_key=lookup_key
                    )
                    djstripe.models.Price.sync_from_stripe_data(new_price)

                # update the product with the provided info
                product = stripe.Product.modify(
                    plan_id,
                    name=product_name,
                    metadata=metadata
                )
                djstripe.models.Product.sync_from_stripe_data(product)

                return Response(status=status.HTTP_200_OK, data={
                    'detail': 'Plan updated successfully'
                })

            except Exception as e:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={
                    'detail': f"Error occurred while updating this plan. Error Info:{e}"
                })
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def test_payment_method(self, request):
        payment_method = stripe.PaymentMethod.create(
            type="card",
            card={
                "number": "4242424242424242",
                "exp_month": 2,
                "exp_year": 2023,
                "cvc": "314",
            },
        )
        return Response(payment_method)

    @action(detail=False, methods=['GET'])
    def setup_intent(self, request, *args, **kwargs):
        try:
            setup_intent = stripe.SetupIntent.create(
                payment_method_types=["card"],

            )
            return Response(status=status.HTTP_200_OK, data=setup_intent)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={
                'detail': f"Error occurred while creating setup intent. ErrorInfo: {str(e)}"
            })

    @swagger_auto_schema(
        method='POST',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['payment_method_id'],
            properties={
                'payment_method_id': openapi.Schema(type=openapi.TYPE_STRING),
            },

        ),
        responses=pay_subscription_responses()
    )
    @action(detail=False, methods=['POST'])
    def add_payment_method(self, request, *args, **kwargs):
        data = request.data
        serializer = PaymentMethodRequestSerializer(data=data)
        if serializer.is_valid():
            try:
                internal_customer = InternalCustomer.objects.filter(user=request.user).first()
                payment_method_id = data.get('payment_method_id', None)
                if internal_customer:
                    customer_id = internal_customer.stripe_id
                else:
                    customer = stripe.Customer.create(email=request.user.email)
                    customer_id = customer.id
                    internal_customer = InternalCustomer.objects.create(user=request.user, stripe_id=customer_id)
                    internal_customer.save()
                    djstripe.models.Customer.sync_from_stripe_data(customer)

                payment_method = stripe.PaymentMethod.attach(payment_method_id, customer=customer_id)
                djstripe.models.PaymentMethod.sync_from_stripe_data(payment_method)
                payment_methods = stripe.PaymentMethod.list(customer=customer_id, type='card')
                return Response(payment_methods)
            except Exception as e:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={
                    'detail': f"An error occurred while processing your request. ErrorInfo: {str(e)}"
                })
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)

    @swagger_auto_schema(
        method='POST',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['payment_method_id'],
            properties={
                'payment_method_id': openapi.Schema(type=openapi.TYPE_STRING),
            },

        ),
        responses=pay_subscription_responses()
    )
    @action(detail=False, methods=['POST'])
    def revoke_payment_method(self, request, *args, **kwargs):
        data = request.data
        serializer = PaymentMethodRequestSerializer(data=data)
        if serializer.is_valid():
            try:
                internal_customer = InternalCustomer.objects.filter(user=request.user).first()
                payment_method_id = data.get('payment_method_id', None)
                customer_id = ""
                if internal_customer:
                    customer_id = internal_customer.stripe_id

                payment_method = stripe.PaymentMethod.detach(payment_method_id)
                djstripe.models.PaymentMethod.sync_from_stripe_data(payment_method)
                if customer_id != "":
                    payment_methods = stripe.PaymentMethod.list(customer=customer_id, type='card')
                    return Response(payment_methods)
                else:
                    return Response(status=status.HTTP_200_OK, data=[])
            except Exception as e:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={
                    'detail': f"An error occurred while processing your request. ErrorInfo: {str(e)}"
                })
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)

    @action(detail=False, methods=['GET'])
    def my_cards(self, request, *args, **kwargs):
        try:
            internal_customer = InternalCustomer.objects.filter(user=request.user).first()
            if internal_customer:
                customer_id = internal_customer.stripe_id
            else:
                customer = stripe.Customer.create(email=request.user.email)
                customer_id = customer.id
                internal_customer = InternalCustomer.objects.create(user=request.user, stripe_id=customer_id)
                internal_customer.save()
                djstripe.models.Customer.sync_from_stripe_data(customer)

            cards = stripe.Customer.list_sources(customer_id, object="card")
            return Response(status=status.HTTP_200_OK, data=cards)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={
                'detail': f"An error occurred while processing your request. ErrorInfo: {str(e)}"
            })

    @swagger_auto_schema(
        method='POST',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['price_id', 'card_id'],
            properties={
                'price_id': openapi.Schema(type=openapi.TYPE_STRING),
                'card_id': openapi.Schema(type=openapi.TYPE_STRING),
            },

        ),
        responses=pay_subscription_responses()
    )
    @action(detail=False, methods=['POST'])
    def pay(self, request, *args, **kwargs):
        price_id = request.data.get('price_id', '')
        card_id = request.data.get('card_id', '')

        internal_customer = InternalCustomer.objects.filter(user=request.user).first()
        if internal_customer:
            customer_id = internal_customer.stripe_id
        else:
            customer = stripe.Customer.create(email=request.user.email)
            customer_id = customer.id
            internal_customer = InternalCustomer.objects.create(user=request.user, stripe_id=customer_id)
            internal_customer.save()
            djstripe.models.Customer.sync_from_stripe_data(customer)

        try:
            subscription = stripe.Subscription.create(
                customer=customer_id,
                default_source=card_id,
                items=[{"price": price_id}]
            )
            djstripe.models.Subscription.sync_from_stripe_data(subscription)

        except Exception as e:
            return Response({'detail': f'Card Declined. ErrorInfo: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK, data={
            "subscription": subscription,
            "message": "subscription created successfully"
        })

    @swagger_auto_schema(
        method='POST',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['subscription_id'],
            properties={
                'subscription_id': openapi.Schema(type=openapi.TYPE_STRING, title='Stripe subscription ID'),
            },

        ),
        responses=cancel_subscription_responses()
    )
    @action(detail=False, methods=['POST'])
    def cancel_subscription(self, request, *args, **kwargs):
        data = request.data
        serializer = CancelSubscriptionRequestSerializer(data=data)
        if serializer.is_valid():
            try:
                subscription = stripe.Subscription.delete(data.get('subscription_id'))
                djstripe.models.Subscription.sync_from_stripe_data(subscription)
                return Response(status=status.HTTP_200_OK, data={'detail': 'Subscription cancelled successfully'})
            except Exception as e:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={
                    "detail": f"Error occurred while processing your request. ErrorInfo: {str(e)}"
                })

        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)

    @swagger_auto_schema(
        method='POST',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['subscription_id', 'new_subscription_price_id'],
            properties={
                'subscription_id': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    title='Stripe subscription ID'
                ),
                'new_subscription_price_id': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    title='New Plan price_id'
                ),
            },

        ),
        responses=change_subscription_plan_responses()
    )
    @action(detail=False, methods=['POST'])
    def change_subscription_plan(self, request, *args, **kwargs):
        data = request.data
        serializer = ChangeSubscriptionRequestSerializer(data=data)
        if serializer.is_valid():
            try:
                subscription = stripe.Subscription.retrieve(data.get('subscription_id'))
                subscription = stripe.Subscription.modify(
                    subscription.id,
                    cancel_at_period_end=False,
                    proration_behavior='create_prorations',
                    items=[{
                        'id': subscription['items']['data'][0].id,
                        'price': data.get('new_subscription_price_id')
                    }]
                )
                djstripe.models.Subscription.sync_from_stripe_data(subscription)
                return Response(status=status.HTTP_200_OK, data={
                    'detail': 'Subscription plan updated successfully'
                })
            except Exception as e:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={
                    "detail": f"Error occurred while processing your request. ErrorInfo: {str(e)}"
                })
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


@webhooks.handler("payment_intent.succeeded")
def payment_success_handler(event, **kwargs):
    pass


@webhooks.handler("customer.subscription.created")
def subscription_created_handler(event, **kwargs):
    subscription_data = event.data.get("object", {})

    subscription = stripe.Subscription.retrieve(
        id=subscription_data.get('id'),
        expand=['items.data.price.product']
    )
    internal_customer = InternalCustomer.objects.filter(stripe_id=subscription_data.get('customer')).first()
    sub, created = InternalSubscription.objects.get_or_create(
        customer=internal_customer,
        stripe_id=subscription.get('id'),
        status=subscription.get('status'),
        price_id=subscription.get('items').get('data')[0].get('price').get('id'),

        defaults={
            'product': subscription.get('items').get('data')[0].get('price').get('product').get('name')
        }

    )

    if not created:
        sub.product = subscription.get('items').get('data')[0].get('price').get('product').get('name')
        sub.save()
    else:
        # send notification
        Notification.objects.get_or_create(
            sender=internal_customer.user,
            receiver=internal_customer.user,
            title='Subscription',
            body=f'You have successfully subscribed to {sub.product} plan'
        )


@webhooks.handler("customer.subscription.updated")
def subscription_updated_handler(event, **kwargs):
    subscription_data = event.data.get("object", {})
    subscription = stripe.Subscription.retrieve(
        id=subscription_data.get('id'),
        expand=['items.data.price.product']
    )
    pass


@webhooks.handler("customer.subscription.deleted")
def subscription_deleted_handler(event, **kwargs):
    subscription_data = event.data.get("object", {})
    subscription = stripe.Subscription.retrieve(
        id=subscription_data.get('id'),
        expand=['items.data.price.product']
    )

    djstripe.models.Subscription.sync_from_stripe_data(subscription)

    internal_customer = InternalCustomer.objects.filter(stripe_id=subscription_data.get('customer')).first()
    try:
        internal_subscription = InternalSubscription.objects.get(
            customer=internal_customer,
            stripe_id=subscription.get('id')
        )
        internal_subscription.status = "cancelled"
        internal_subscription.save()
        Notification.objects.get_or_create(
            sender=internal_customer.user,
            receiver=internal_customer.user,
            title='Subscription',
            body=f'You have successfully cancelled  {internal_subscription.product} plan'
        )
    except InternalSubscription.DoesNotExist:
        pass


@webhooks.handler("customer.subscription.trial_will_end")
def subscription_trial_will_end_handler(event, **kwargs):
    # todo create notification and send a push notification to the
    #  client device
    pass


@webhooks.handler("customer.deleted")
def customer_deleted_handler(event, **kwargs):
    customer = event.data.get("object", {})
    customer_id = customer.get('id')
    try:
        internal_customer = InternalCustomer.objects.get(stripe_id=customer_id)
        # delete from local database
        internal_customer.delete()
    except InternalCustomer.DoesNotExist:
        pass


def get_assets_links_json(request):
    # Specify the path to your JSON file
    json_file_path = os.path.join(BASE_DIR, 'assets_links.json')

    # Check if the file exists
    if os.path.exists(json_file_path):
        with open(json_file_path, 'r') as file:
            json_data = json.load(file)
            return JsonResponse(json_data, safe=False)
    else:
        return JsonResponse({'error': 'JSON file not found'}, status=404)


def get_apple_app_association_json(request):
    # Specify the path to your JSON file
    json_file_path = os.path.join(BASE_DIR, 'apple-app-association.json')

    # Check if the file exists
    if os.path.exists(json_file_path):
        with open(json_file_path, 'r') as file:
            json_data = json.load(file)
            return JsonResponse(json_data[0])
    else:
        return JsonResponse({'error': 'JSON file not found'}, status=404)
