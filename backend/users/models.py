from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Theme(models.TextChoices):
        LIGHT = "light", "Light"
        DARK = "dark", "Dark"

    class Language(models.TextChoices):
        PL = "pl", "Polish"
        EN = "en", "English"

    email = models.EmailField(
        null=True,
        blank=True,
        db_index=True,
    )

    theme = models.CharField(
        max_length=10,
        choices=Theme.choices,
        default=Theme.DARK,
    )

    language = models.CharField(
        max_length=6,
        choices=Language.choices,
        default=Language.EN,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["email"],
                condition=models.Q(email__isnull=False),
                name="unique_email_if_not_null"
            )
        ]

    def save(self, *args, **kwargs): 
        if self.email == "": 
            self.email = None 
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
