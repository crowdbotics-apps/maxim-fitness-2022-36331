from drf_yasg import openapi
from drf_yasg.openapi import TYPE_OBJECT, Schema
from rest_framework import status


def create_param(param_name, description="", param_type=None, required=False):
    return openapi.Parameter(
        param_name,
        openapi.IN_QUERY,
        description=description,
        type=param_type,
        required=required,
    )


def pay_subscription_responses():
    responses = {
        status.HTTP_200_OK: Schema(
            type=TYPE_OBJECT,
            properties={
                "status": openapi.Schema(
                    title="OK",
                    type=openapi.TYPE_STRING,
                ),
                "client_secret": openapi.Schema(
                    title="Client Secret",
                    type=openapi.TYPE_STRING,
                ),
                "payment_intent": openapi.Schema(
                    title="Stripe Payment Intent",
                    type=openapi.TYPE_OBJECT
                )
            },

        ),
        status.HTTP_400_BAD_REQUEST: Schema(
            type=TYPE_OBJECT,
            properties={
                "status": openapi.Schema(
                    title="Error Bad Request",
                    type=openapi.TYPE_STRING
                ),
                "detail": openapi.Schema(
                    title='Card declined',
                    type=openapi.TYPE_STRING
                )
            }
        )
    }
    return responses


def cancel_subscription_responses():
    responses = {
        status.HTTP_200_OK: Schema(
            type=TYPE_OBJECT,
            properties={
                "status": openapi.Schema(
                    title="OK",
                    type=openapi.TYPE_STRING,
                ),
                "detail": openapi.Schema(
                    title="Subscription cancelled successfully",
                    type=openapi.TYPE_STRING,
                ),

            },

        ),
        status.HTTP_400_BAD_REQUEST: Schema(
            type=TYPE_OBJECT,
            properties={
                "status": openapi.Schema(
                    title="Error Bad Request",
                    type=openapi.TYPE_STRING
                ),
                "errors": openapi.Schema(
                    title='Errors',
                    type=openapi.TYPE_OBJECT
                )
            }
        )
    }
    return responses


def change_subscription_plan_responses():
    responses = {
        status.HTTP_200_OK: Schema(
            type=TYPE_OBJECT,
            properties={
                "status": openapi.Schema(
                    title="OK",
                    type=openapi.TYPE_STRING,
                ),
                "detail": openapi.Schema(
                    title="Subscription updated successfully",
                    type=openapi.TYPE_STRING,
                ),

            },

        ),
        status.HTTP_400_BAD_REQUEST: Schema(
            type=TYPE_OBJECT,
            properties={
                "status": openapi.Schema(
                    title="Error Bad Request",
                    type=openapi.TYPE_STRING
                ),
                "errors": openapi.Schema(
                    title='Errors',
                    type=openapi.TYPE_OBJECT
                )
            }
        )
    }
    return responses


def create_trail_responses():
    responses = {
        status.HTTP_200_OK: Schema(
            type=TYPE_OBJECT,
            properties={
                "status": openapi.Schema(
                    title="OK",
                    type=openapi.TYPE_STRING,
                ),
                "detail": openapi.Schema(
                    title="Subscription created successfully",
                    type=openapi.TYPE_STRING,
                ),

            },

        ),
        status.HTTP_400_BAD_REQUEST: Schema(
            type=TYPE_OBJECT,
            properties={
                "status": openapi.Schema(
                    title="Error Bad Request",
                    type=openapi.TYPE_STRING
                ),
                "errors": openapi.Schema(
                    title='Errors',
                    type=openapi.TYPE_OBJECT
                )
            }
        )
    }
    return responses


def update_plan_responses():
    responses = {
        status.HTTP_200_OK: Schema(
            type=TYPE_OBJECT,
            properties={
                "status": openapi.Schema(
                    title="OK",
                    type=openapi.TYPE_STRING,
                ),
                "detail": openapi.Schema(
                    title="plan  updated successfully",
                    type=openapi.TYPE_STRING,
                ),

            },

        ),
        status.HTTP_400_BAD_REQUEST: Schema(
            type=TYPE_OBJECT,
            properties={
                "status": openapi.Schema(
                    title="Error Bad Request",
                    type=openapi.TYPE_STRING
                ),
                'detail': openapi.Schema(
                    title='Error Occurred',
                    type=openapi.TYPE_STRING
                ),
                "errors": openapi.Schema(
                    title='Errors',
                    type=openapi.TYPE_OBJECT
                )
            }
        )
    }
    return responses