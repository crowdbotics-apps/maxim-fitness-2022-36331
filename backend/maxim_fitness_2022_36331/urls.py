"""maxim_fitness_2022_36331 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic.base import TemplateView
from allauth.account.views import confirm_email
from rest_framework import permissions
from rest_framework import authentication
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static

from subscriptions.views import get_apple_app_association_json, get_assets_links_json

urlpatterns = [
                  path("", include("home.urls")),
                  path('apple-app-site-association', get_apple_app_association_json, name='get_json_association_site'),
                  path('.well-known/assetlinks.json', get_assets_links_json, name='get_json_assetslinks'),
                  path("accounts/", include("allauth.urls")),
                  path("modules/", include("modules.urls")),
                  path("api/v1/", include("home.api.v1.urls")),
                  path("api/v1/", include("notification.api.v1.urls")),
                  path("admin/", admin.site.urls),
                  path("users/", include("users.urls", namespace="users")),
                  path("rest-auth/", include("rest_auth.urls")),
                  # Override email confirm to use allauth's HTML view instead of rest_auth's API view
                  path("rest-auth/registration/account-confirm-email/<str:key>/", confirm_email),
                  path("rest-auth/registration/", include("rest_auth.registration.urls")),
                  path("stripe/", include("djstripe.urls", namespace="djstripe")),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = "Maxim Fitness - 2022"
admin.site.site_title = "Maxim Fitness - 2022 Admin Portal"
admin.site.index_title = "Maxim Fitness - 2022 Admin"

# swagger
api_info = openapi.Info(
    title="Maxim Fitness - 2022 API",
    default_version="v1",
    description="API documentation for Maxim Fitness - 2022 App",
)

schema_view = get_schema_view(
    api_info,
    public=True,
    permission_classes=[permissions.IsAuthenticated],
    authentication_classes=[authentication.SessionAuthentication, authentication.TokenAuthentication]
)

urlpatterns += [
    path("api-docs/", schema_view.with_ui("swagger", cache_timeout=0), name="api_docs")
]

urlpatterns += [path("", TemplateView.as_view(template_name='index.html'))]
urlpatterns += [re_path(r"^(?:.*)/?$",
                        TemplateView.as_view(template_name='index.html'))]
