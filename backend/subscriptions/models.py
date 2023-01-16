from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class InternalCustomer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stripe_id = models.CharField(max_length=128, blank=True, null=True)

    def __str__(self):
        return f"{self.stripe_id}"


class InternalSubscription(models.Model):
    STATUS = (
        ('active', 'active'),
        ('past_due', 'past_due'),
        ('unpaid', 'unpaid'),
        ('cancelled', 'cancelled'),
        ('incomplete', 'incomplete'),
        ('trialing', 'trialing'),
        ('incomplete_expired', 'incomplete_expired'),
    )
    customer = models.ForeignKey(InternalCustomer, on_delete=models.CASCADE, related_name='subscriptions')
    stripe_id = models.CharField(max_length=255, null=True, blank=True)
    stripe_price_id = models.CharField(max_length=255, null=True, blank=True)
    stripe_product_id = models.CharField(max_length=255, null=True, blank=True)
    plan_name = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=32, choices=STATUS, default='unpaid')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.stripe_id}"

