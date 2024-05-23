from django.db import models

import wget
import os

from django.utils import timezone
from friendship.models import FollowingManager, Follow, bust_cache
from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import Q
from django.conf import settings

from autoslug import AutoSlugField
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from solo.models import SingletonModel
from home.nutritionix import Nutritionix
from thumbnail import generate_thumbnail
from django.core.files import File
from home.utils import send_notification
from maxim_fitness_2022_36331.settings import MEDIA_URL, MEDIA_ROOT

from program.models import Program, Session
from users.models import AnswerProgram

User = get_user_model()
nix = Nutritionix(settings.NIX_APP_ID, settings.NIX_API_KEY)


class Product(models.Model):
    name = models.CharField("Name", max_length=200)
    calories = models.FloatField(default=0.0)
    proteins = models.FloatField(default=0.0)
    carbohydrate = models.FloatField(default=0.0)
    fat = models.FloatField(default=0.0)
    code = models.CharField("Product Code", max_length=150, null=True, blank=True)
    weight = models.CharField("Weight", max_length=150, null=True, blank=True)
    thumb = models.URLField()

    def __str__(self):
        return self.name

    @staticmethod
    def get_or_add_product(food_item):
        food = Product.objects.filter(
            Q(name=food_item['food_name']) | (~Q(code=None) & Q(code=food_item.get('item_id')))).first()
        if not food:
            if food_item.get('item_id'):
                response = nix.item_detail(item_id=food_item['item_id'])
                temp_food = response.get('foods')
            elif food_item.get('nix_item_id'):
                response = nix.item_detail(item_id=food_item['nix_item_id'])
                temp_food = response.get('foods')
                print(temp_food)
            else:
                response = nix.food_detail(food_item['food_name'])
                temp_food = response.get('foods')
            print(temp_food[0])
            if temp_food:
                temp_food = temp_food[0]
                food = Product.objects.create(
                    name=temp_food['food_name'],
                    code=temp_food['nix_item_id'],
                    thumb=temp_food['photo']['thumb'],
                    calories=temp_food['nf_calories'],
                    proteins=temp_food['nf_protein'],
                    carbohydrate=temp_food['nf_total_carbohydrate'],
                    weight=temp_food['serving_weight_grams'],
                    fat=temp_food['nf_total_fat']
                )
                if food_item.get('nix_item_id'):
                    unit, created = ProductUnit.objects.get_or_create(product=food, name=temp_food['serving_unit'])
                    unit.weight = temp_food['serving_weight_grams']
                    unit.quantity = temp_food['serving_qty']
                    unit.save()
                if food_item.get('alt_measures'):
                    for units in temp_food.get('alt_measures', []):
                        ProductUnit.objects.create(
                            product=food,
                            name=units['measure'],
                            weight=units['serving_weight'],
                            quantity=units['qty']
                        )
        return food

    @staticmethod
    def get_or_add_product_from_nix(food_item):
        food = Product.objects.filter(
            Q(name=food_item['food_name']) & (~Q(code=None) & Q(code=food_item['nix_item_id'])
                                              & Q(calories=food_item['nf_calories']))).first()
        if not food:
            food = Product.objects.create(
                name=food_item['food_name'],
                code=food_item['nix_item_id'],
                thumb=food_item['thumb'],
                calories=food_item['nf_calories'],
                proteins=food_item['nf_protein'],
                carbohydrate=food_item['nf_total_carbohydrate'],
                weight=food_item['weight'],
                fat=food_item['nf_total_fat']
            )
            if food_item['nix_item_id']:
                unit, created = ProductUnit.objects.get_or_create(product=food, name=food_item['serving_unit'])
                unit.weight = food_item['weight'] if food_item['weight'] else 0
                unit.quantity = food_item['serving_qty']
                unit.save()
            # if food_item['alt_measures']:
            #     for units in food_item.get('alt_measures', []):
            #         ProductUnit.objects.create(
            #             product=food,
            #             name=units['measure'],
            #             weight=units['serving_weight'],
            #             quantity=units['qty']
            #         )
        return food

    @staticmethod
    def get_or_add_food_from_sentence(meal_history, meal_time, query):
        if query[0]["common"]:
            food_items = query[0]["common"]
            add_food_items(food_items, meal_history, meal_time)
        if query[0]["branded"]:
            food_items = query[0]["branded"]
            add_food_items(food_items, meal_history, meal_time)
        if query[0]["voice"]:
            food_items = query[0]["voice"]
            add_food_items(food_items, meal_history, meal_time)
        if query[0]["scan"]:
            food_items = query[0]["scan"]
            add_food_items(food_items, meal_history, meal_time)
        return "food item added"


def add_food_items(food_items, meal_history, meal_time):
    for food_item in food_items:
        final_food = Product.get_or_add_product_from_nix(food_item)
        unit, created = ProductUnit.objects.get_or_create(product=final_food, name=food_item['serving_unit'])
        unit.weight = food_item['weight']
        unit.quantity = food_item['serving_qty']
        unit.save()
        if meal_time.date_time.date() < timezone.now().date():
            created = timezone.now()
        else:
            created = meal_time.date_time
        food = FoodItem.objects.create(meal_history=meal_history, food=final_food, portion=food_item['serving_qty'], unit=unit,
                                            created=created, meal_time=meal_time)
        if food_item['alt_measures']:
            alt_measures = food_item['alt_measures']
            for measure in alt_measures:
                AltMeasure.objects.create(
                    serving_weight=measure['serving_weight'],
                    measure=measure['measure'], food_item=food, meal_history=meal_history, product=final_food,
                    seq=measure['seq'], qty=measure['qty'])

    return "Food item added."


class ProductUnit(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='units')
    name = models.CharField("Name", max_length=200)
    weight = models.FloatField(default=0.0)
    quantity = models.FloatField(default=0)

    def __str__(self):
        return self.name


class Food(models.Model):
    name = models.CharField(max_length=150)
    ingredients = models.ManyToManyField('Product')

    def __str__(self):
        return self.name

    @property
    def carbohydrate(self):
        ingredients = self.ingredients.all()
        carb = float()
        for ing in ingredients:
            carb += ing.carbohydrate
        return carb

    @property
    def protein(self):
        ingredients = self.ingredients.all()
        protein = float()
        for ing in ingredients:
            protein += ing.proteins
        return protein

    @property
    def fat(self):
        ingredients = self.ingredients.all()
        fat = float()
        for ing in ingredients:
            fat += ing.fat
        return fat

    @property
    def calories(self):
        ingredients = self.ingredients.all()
        calories = float()
        for ing in ingredients:
            calories += ing.calories
        return calories


class FoodItem(models.Model):
    food = models.ForeignKey('Product', related_name='food_food_items', on_delete=models.CASCADE)
    portion = models.FloatField(default=0.0, validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], )
    unit = models.ForeignKey(ProductUnit, on_delete=models.SET_NULL, null=True)
    # meal = models.ForeignKey('Meal', related_name='food_items', on_delete=models.CASCADE)
    meal_time = models.ForeignKey('MealTime', related_name='food_items_times', on_delete=models.CASCADE, null=True, blank=True)
    meal_history = models.ForeignKey('MealHistory', null=True, blank=True,
                                     related_name='food_items_history', on_delete=models.CASCADE)
    created = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.food.name

    def get_quantity(self):
        if not self.unit:
            return self.portion
        return self.portion / self.unit.quantity

    def get_weight(self):
        if not self.unit:
            return 1
        if not self.food.weight:
            self.food.weight = 1
        return self.unit.weight / float(self.food.weight)

    @property
    def carbohydrate(self):
        return self.get_quantity() * self.get_weight() * self.food.carbohydrate

    @property
    def protein(self):
        return self.get_quantity() * self.get_weight() * self.food.proteins

    @property
    def fat(self):
        return self.get_quantity() * self.get_weight() * self.food.fat

    @property
    def calories(self):
        return self.get_quantity() * self.get_weight() * self.food.calories


class AltMeasure(models.Model):
    serving_weight = models.FloatField()
    measure = models.CharField(max_length=255)
    food_item = models.ForeignKey('FoodItem', on_delete=models.CASCADE, null=True, blank=True, related_name='food_items')
    # meal = models.ForeignKey('Meal', on_delete=models.CASCADE, null=True, blank=True, related_name='meal_measures')
    meal_history = models.ForeignKey('MealHistory', on_delete=models.CASCADE, null=True, blank=True,
                                     related_name='meal_history_measures')
    product = models.ForeignKey('Product', on_delete=models.CASCADE, null=True, blank=True)
    seq = models.IntegerField(null=True, blank=True)
    qty = models.FloatField()

    def __str__(self):
        return f"{self.measure} - {self.qty}"


class Meal(models.Model):
    user = models.ForeignKey(User, related_name='meals', on_delete=models.CASCADE)
    no_of_meals = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f'{self.user} -> {self.no_of_meals}'


class MealTime(models.Model):
    meal = models.ForeignKey(Meal, related_name="time_meals", on_delete=models.CASCADE)
    date_time = models.DateTimeField(null=True, blank=True)
    meal_name = models.CharField(max_length=50, null=True, blank=True, default="")
    # is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.date_time}__{self.id}"


class MealHistory(models.Model):
    meal = models.ForeignKey(Meal, related_name="meals_history", on_delete=models.CASCADE)
    meal_date_time = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, related_name='meals_history_user', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.meal_date_time}_{self.user}"


class Category(models.Model):
    name = models.CharField(max_length=150)
    slug = AutoSlugField(populate_from='name')

    def __str__(self):
        return self.name


class Recipe(models.Model):
    category = models.ForeignKey('Category', related_name='recipes', on_delete=models.DO_NOTHING)
    image = models.ImageField(upload_to='recipe_images', null=True, blank=True)
    name = models.CharField(max_length=200)
    time_to_prepare = models.PositiveIntegerField()
    directions = models.TextField()

    def __str__(self):
        return self.name

    @property
    def carbohydrate(self):
        foods = self.recipe_items.all()
        carb = float()
        for ing in foods:
            carb += ing.carbohydrate
        return carb

    @property
    def protein(self):
        foods = self.recipe_items.all()
        protein = float()
        for ing in foods:
            protein += ing.protein
        return protein

    @property
    def fat(self):
        foods = self.recipe_items.all()
        fat = float()
        for ing in foods:
            fat += ing.fat
        return fat

    @property
    def calories(self):
        foods = self.recipe_items.all()
        calories = float()
        for ing in foods:
            calories += ing.calories
        return calories

    def add_fav(self, user):
        fav, created = FavoriteRecipe.objects.get_or_create(recipe=self, user=user)
        if not created:
            fav.delete()

    def get_fav(self, user):
        fav = FavoriteRecipe.objects.filter(recipe=self, user=user)
        if fav:
            return True
        return False


class RecipeItem(models.Model):
    food = models.ForeignKey('Product', related_name='recipe_food_items', on_delete=models.CASCADE)
    portion = models.FloatField(default=0.0, validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], )
    recipe = models.ForeignKey('Recipe', related_name='recipe_items', on_delete=models.CASCADE)

    def __str__(self):
        return self.food.name

    @property
    def carbohydrate(self):
        return self.food.carbohydrate * self.portion

    @property
    def protein(self):
        return self.food.proteins * self.portion

    @property
    def fat(self):
        return self.food.fat * self.portion

    @property
    def calories(self):
        return self.food.calories * self.portion


class FavoriteRecipe(models.Model):
    recipe = models.ForeignKey('Recipe', related_name='favorites', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='user_favorites', on_delete=models.CASCADE)


class Post(models.Model):
    user = models.ForeignKey(User, related_name='posts', null=True, on_delete=models.CASCADE)
    title = models.CharField(max_length=500, null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    hide = models.BooleanField(default=False)

    def __str__(self):
        return str(self.content)

    def add_comment(self, user, comment):
        comm = Comment.objects.create(
            post=self,
            user=user,
            content=comment
        )
        return comm

    def add_like(self, user):
        from notification.models import Notification
        like, created = Like.objects.get_or_create(post=self, user=user)
        if not created:
            like.delete()
            notification = Notification.objects.filter(sender=user, receiver=self.user, title="Like Post",
                                                       post=self).first()
            if notification:
                notification.delete()
        else:
            if not (user == self.user):
                send_notification(sender=user, receiver=self.user,
                                  title="Like Post", message=f"{user.username} like your post.", post_id=self,
                                  extra={"post_id": self.id, "sender": user.id, "receiver": self.user.id}
                                  )

    def get_like(self, user):
        like = Like.objects.filter(post=self, user=user)
        if like:
            return True
        return False

    @property
    def likes_count(self):
        return self.likes.all().count()


class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_image_video")
    image = models.ImageField(upload_to="post_image/image", null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.post.title)


class PostVideo(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_video")
    video = models.FileField(upload_to="post_video/video")
    video_thumbnail = models.FileField(upload_to='post_video/thumbnail', null=True, blank=True)
    created = models.DateField(auto_now_add=True)

    # @property
    # def video_thumbnail_url(self):
    #     if self.video_thumbnail:
    #         url = s3.generate_presigned_url(
    #             ClientMethod='get_object',
    #             Params={
    #                 'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
    #                 'Key': "media/" + self.video_thumbnail.name
    #             })
    #         return url
    #     return None


class Comment(models.Model):
    post = models.ForeignKey('Post', related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='user_comment', on_delete=models.CASCADE)
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"{self.content}"

    class Meta:
        ordering = ('-created',)

    def get_like(self, user):
        comment_like = PostCommentLike.objects.filter(comment=self, user=user)
        if comment_like:
            return True
        return False

    @property
    def likes_count(self):
        return self.comment_like.all().count()


class ReportAComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="report_comment_user")
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="report_comments")
    reason = models.CharField(max_length=300, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reason}"


class Like(models.Model):
    post = models.ForeignKey('Post', related_name='likes', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='user_likes', on_delete=models.CASCADE)


class Form(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


class QuestionType(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Question(models.Model):
    type = models.ForeignKey(QuestionType, on_delete=models.CASCADE)
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name='questions')
    text = models.CharField(max_length=500)

    def __str__(self):
        return self.text


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    next_form = models.ForeignKey(Form, on_delete=models.SET_NULL, null=True, blank=True)
    final_program = models.ForeignKey(Program, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.text


class UserProgram(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_program")
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name="program_user")

    def __str__(self):
        return str(self.user)

    class Meta:
        unique_together = ('user', 'program')


class CaloriesRequired(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_calories')
    calories = models.DecimalField(max_digits=16, decimal_places=2, null=True, blank=True, default=0.0)
    protein = models.DecimalField(max_digits=16, decimal_places=2, null=True, blank=True, default=0.0)
    carbs = models.DecimalField(max_digits=16, decimal_places=2, null=True, blank=True, default=0.0)
    fat = models.DecimalField(max_digits=16, decimal_places=2, null=True, blank=True, default=0.0)
    created = models.DateField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return str(self.user)


class ConsumeCalories(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='consume_calories')
    calories = models.IntegerField()
    protein = models.IntegerField()
    carbs = models.IntegerField()
    fat = models.IntegerField()
    goals_values = models.ForeignKey(CaloriesRequired, on_delete=models.CASCADE, null=True, blank=True,
                                     related_name='goals_values')
    created = models.DateField(editable=True, auto_now_add=True)

    def __str__(self):
        return str(self.user)


@receiver(post_save, sender=UserProgram)
def program_assign_user(sender, instance, created, **kwargs):
    instance.program.create_session(instance.user)


@receiver(post_delete, sender=UserProgram)
def program_assign_user_delete(sender, instance, **kwargs):
    Session.objects.filter(user=instance.user).delete()


@receiver(post_save, sender=PostVideo)
def save_video_thumbnail(sender, instance, created, **kwargs):
    if created:
        post_video = PostVideo.objects.get(id=instance.id)
        path_to_file = MEDIA_URL + post_video.video.name
        filename_sp = post_video.video.name.split("/")[-1].split(".")[0]
        destination_file_name = f"{filename_sp}.{post_video.video.name.split('.')[-1]}"
        thumbnail_file_name = f"{filename_sp}.png"
        try:
            wget.download(post_video.video.url, destination_file_name)
            options = {
                'trim': False,
                'height': 300,
                'width': 300,
                'quality': 85,
                'type': 'thumbnail'
            }
            generate_thumbnail(destination_file_name, thumbnail_file_name, options)
            # TODO: upload thumbnail_file_name to post_video.thumbnail
            post_video.video_thumbnail.save(thumbnail_file_name, File(open(thumbnail_file_name, 'rb')), save=True)
        except Exception as e:
            print(e)
        finally:
            os.remove(destination_file_name)
            os.remove(thumbnail_file_name)


class Following(FollowingManager):
    def add_follower(follower, followee=None):
        """ Create 'follower' follows 'followee' relationship """
        if follower == followee:
            raise ValidationError("Users cannot follow themselves")

        relation, created = Follow.objects.get_or_create(
            follower=follower, followee=followee
        )

        if created is False:
            a = 'already follows'
            return a
            # raise AlreadyExistsError(
            #     f"User '{follower}' already follows '{followee}'"

        # follower_created.send(sender=self, follower=follower)
        # followee_created.send(sender=self, followee=followee)
        # following_created.send(sender=self, following=relation)

        bust_cache("followers", followee.pk)
        bust_cache("following", follower.pk)

        return relation


class ReportAPost(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="report_user")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="report_post")
    reason = models.CharField(max_length=300, null=True, blank=True)
    comment = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    resolved = models.BooleanField(default=False)

    def __str__(self):
        return str(self.user)


class ReportAUser(models.Model):
    reporter_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reporter_user")
    Banned_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="banned_user")
    reason = models.CharField(max_length=300, null=True, blank=True)
    comment = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    resolved = models.BooleanField(default=False)

    def __str__(self):
        return str(self.reporter_user)


class BlockUser(models.Model):
    requested_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="request_user")
    blocked_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="block_user")
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.requested_user)


class Chat(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_user')
    match_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='match_user')
    path = models.TextField()

    def __str__(self):
        return str(self.user)


@receiver(post_save, sender=ReportAPost)
def resolve_post(sender, instance, created, **kwargs):
    from notification.models import Notification
    if instance.resolved:
        post = Post.objects.get(id=instance.post.id)
        post.hide = True
        post.save()
        Notification.objects.filter(post_id=post.id).delete()


class PostCommentReply(models.Model):
    comment = models.ForeignKey('Comment', related_name='post_comment_reply', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='user_comment_reply', on_delete=models.CASCADE)
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return str(self.content)

    def get_like(self, user):
        comment_like = PostCommentLike.objects.filter(comment_reply=self, user=user)
        if comment_like:
            return True
        return False

    @property
    def likes_count(self):
        return self.comment_like_reply.all().count()


class PostCommentLike(models.Model):
    comment = models.ForeignKey('Comment', related_name='comment_like', on_delete=models.CASCADE, null=True, blank=True)
    comment_reply = models.ForeignKey('PostCommentReply', related_name='comment_like_reply', on_delete=models.CASCADE,
                                      null=True, blank=True)
    user = models.ForeignKey(User, related_name='user_like_comment', on_delete=models.CASCADE)


class ReportCommentReply(models.Model):
    """Report a reply of a comment"""
    comment_reply = models.ForeignKey('PostCommentReply', related_name='report_post_comment_reply',
                                      on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='user_report_comment_reply', on_delete=models.CASCADE, null=True,
                             blank=True)
    reason = models.CharField(max_length=500)
    created = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"{self.user}--{self.comment_reply}"


class CancelSubscription(models.Model):
    user = models.ForeignKey(User, related_name='user_cancel_subscriptions', on_delete=models.CASCADE)
    subscription_id = models.CharField(max_length=50, unique=True)
    subscription_end_date = models.DateField(null=True, blank=True)
    is_subscription_canceled = models.BooleanField(default=False)
    is_subscription_days_remaining = models.BooleanField(default=False)
    is_current = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class DuplicateCard(models.Model):
    user = models.ForeignKey(User, related_name='user_cards', on_delete=models.CASCADE)
    card_number = models.CharField(max_length=20)


