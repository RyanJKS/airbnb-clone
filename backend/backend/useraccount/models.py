import uuid
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager


class CustomUserManager(UserManager):
    def _create_user(self, name, email, password, **extra_fields):
        if not email:
            raise ValueError("Please provide a valid email address")
        
        email = self.normalize_email(email) #  normalize_email available in UserManager class
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password) # Password will be hashed/encryptes
        user.save(using=self.db)
        return user
        
    def create_user(self,name=None,email=None,password=None,**extra_fields):
        extra_fields.setdefault('is_staff',False)
        extra_fields.setdefault('is_superuser',False)
        return self._create_user(name, email, password, **extra_fields)
    
    def create_superuser(self,name=None,email=None,password=None,**extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_superuser',True)
        return self._create_user(name, email, password, **extra_fields)
    

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    profile_img = models.ImageField(upload_to='upload/profile_img') # location is defined in server settings
    
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(blank=True, null=True)
    
    objects = CustomUserManager() # redefined objects in order to fetch data later
    
    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    def profile_img_url(self):
        if self.profile_img:
            return f'{settings.WEBSITE_URL}{self.profile_img.url}'
        else:
            return ''