from django.contrib import admin
from .models import CustomUser, Feedback

# Register CustomUser model to be visible in the admin panel
admin.site.register(CustomUser)

# Register Feedback model (if not already registered)
admin.site.register(Feedback)
