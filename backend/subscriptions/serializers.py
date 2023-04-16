from rest_framework import serializers
from .models import InternalCustomer, InternalSubscription


class InternalCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternalCustomer
        fields = ('stripe_id',)


class InternalSubscriptionSerializer(serializers.ModelSerializer):
    customer = InternalCustomerSerializer(read_only=True, many=False)

    class Meta:
        model = InternalSubscription
        fields = '__all__'


class PaymentMethodRequestSerializer(serializers.Serializer):
    payment_method_id = serializers.CharField(max_length=128, required=True, allow_null=False)

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass


class PaymentRequestSerializer(serializers.Serializer):
    payment_method_id = serializers.CharField(max_length=128, required=True, allow_null=False)
    price_id = serializers.CharField(max_length=128, required=True, allow_null=False)
    save_card = serializers.BooleanField(required=True, allow_null=False)

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass


class CancelSubscriptionRequestSerializer(serializers.Serializer):
    subscription_id = serializers.CharField(max_length=255, required=True, allow_null=False)

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass


class ChangeSubscriptionRequestSerializer(serializers.Serializer):
    subscription_id = serializers.CharField(max_length=128, required=True, allow_null=False)
    new_subscription_price_id = serializers.CharField(max_length=255, required=True, allow_null=False)

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass


INTERVAL_CHOICES = (
    ('day', 'day'),
    ('week', 'week'),
    ('month', 'month'),
    ('year', 'year')
)


class UpdatePlanRequestSerializer(serializers.Serializer):
    plan_id = serializers.CharField(help_text='Plan ID', allow_blank=False, allow_null=False)
    plan = serializers.CharField(help_text='Plan Name, eg. Premium', allow_blank=False, allow_null=False)
    currency = serializers.CharField(help_text='Currency eg. usd', allow_blank=False, allow_null=False)
    price_id = serializers.CharField(help_text='Price Id of selected plan', allow_blank=False, allow_null=False)
    new_price_amount = serializers.IntegerField(help_text='Price amount in cents',required=True)
    interval = serializers.ChoiceField(help_text='Billing interval', allow_blank=False, allow_null=False,
                                       choices=INTERVAL_CHOICES, default=INTERVAL_CHOICES[2][0])

    features = serializers.CharField(help_text='Plan features, comma separated', allow_blank=False, allow_null=False)

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass


class CardDetailSerializer(serializers.Serializer):
    card_holder_name = serializers.CharField(required=True)
    card_number = serializers.CharField(required=True)
    card_exp_month = serializers.CharField(required=True)
    card_exp_year = serializers.CharField(required=True)
    card_cvc = serializers.CharField(required=True)
    default = serializers.BooleanField(required=False)
