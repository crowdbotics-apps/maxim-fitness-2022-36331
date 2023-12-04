from django.contrib import admin

# Register your models here.
from django.http import HttpResponseRedirect
from django.utils.safestring import mark_safe

from .models import Product, ProductUnit, Food, Meal, FoodItem, Category, Recipe, \
    RecipeItem, Post, Comment, Form, QuestionType, Question, Answer, UserProgram, CaloriesRequired, Like, \
    ConsumeCalories, ReportAPost, BlockUser, PostImage, PostCommentReply, PostCommentLike, PostVideo
import nested_admin


class FoodItemInline(admin.TabularInline):
    model = FoodItem
    fields = ["food", "portion", "unit"]


class ProductUnitInline(admin.TabularInline):
    model = ProductUnit


class RecipeItemInline(admin.TabularInline):
    model = RecipeItem


class ProductAdmin(admin.ModelAdmin):
    '''
        Admin View for Products
    '''
    list_display = ('name', 'calories', 'proteins', 'carbohydrate', 'weight', 'code')
    search_fields = ('name',)
    inlines = [ProductUnitInline]


admin.site.register(Product, ProductAdmin)


class FoodAdmin(admin.ModelAdmin):
    '''
        Admin View for
    '''
    search_fields = ('name',)


admin.site.register(Food, FoodAdmin)


class MealAdmin(admin.ModelAdmin):
    '''
        Admin View for
    '''
    inlines = [FoodItemInline]


admin.site.register(Meal, MealAdmin)


class RecipeAdmin(admin.ModelAdmin):
    '''
        Admin View for
    '''
    list_filter = ('category__name',)
    inlines = [
        RecipeItemInline,
    ]
    search_fields = ('name', 'category__name')


class UserProgramAdmin(admin.ModelAdmin):
    list_display = ["user", "program"]


class PostAdmin(admin.ModelAdmin):
    list_display = ["user", "title", 'content', 'hide']


class CommentAdmin(admin.ModelAdmin):
    list_display = ["post", "user", 'content', 'created']


admin.site.register(Recipe, RecipeAdmin)

admin.site.register(Category)

admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)


class AnswerInline(nested_admin.NestedTabularInline):
    model = Answer


class QuestionInline(nested_admin.NestedStackedInline):
    model = Question
    extra = 1
    inlines = [AnswerInline]


class FormAdmin(nested_admin.NestedModelAdmin):
    model = Form
    inlines = [QuestionInline]


class FoodItemAdmin(admin.ModelAdmin):
    list_display = ["id", "food", "created"]


class CaloriesRequiredAdmin(admin.ModelAdmin):
    list_display = ['user', 'calories', 'protein', 'carbs', 'fat', 'created']


class ConsumeCaloriesAdmin(admin.ModelAdmin):
    list_display = ['user', 'calories', 'protein', 'carbs', 'fat', 'created']


class ReportAPostAdmin(admin.ModelAdmin):
    # list_display = ["user", "post", "comment", "reason", "resolved",  "created"]
    # change_form_template = "home/resolve.html"

    def response_change(self, request, obj):
        if "resolve" in request.POST:
            obj.resolved = True
            obj.save()
            self.message_user(request, "This post is know resolve")
            # return HttpResponseRedirect(".")
        return super().response_change(request, obj)

    # def image_tag(self, obj):
    #     if obj.post.image:
    #         return mark_safe('<img src="%s" style="width: 45px; height:45px;" />' % obj.post.image_url)
    #
    # def post_image(self, obj):
    #     return mark_safe('<img src="%s" style="width: 400px; height:400px;" />' % obj.post.image_url)
    #
    # image_tag.short_description = 'Post Image'

    list_display = ["user", "post", "comment", "reason", "resolved",  "created"]
    # readonly_fields = ["post_image"]


class BlockUserAdmin(admin.ModelAdmin):
    list_display = ["requested_user", "blocked_user", "created"]


class PostImageVideoAdmin(admin.ModelAdmin):
    list_display = ["id", "post", "image", "created"]


admin.site.register(Form, FormAdmin)
admin.site.register(QuestionType)
admin.site.register(UserProgram, UserProgramAdmin)
admin.site.register(FoodItem, FoodItemAdmin)
admin.site.register(CaloriesRequired, CaloriesRequiredAdmin)
admin.site.register(Like)
admin.site.register(ConsumeCalories, ConsumeCaloriesAdmin)
admin.site.register(ProductUnit)
admin.site.register(ReportAPost, ReportAPostAdmin)
admin.site.register(BlockUser, BlockUserAdmin)
admin.site.register(PostImage, PostImageVideoAdmin)
admin.site.register(PostCommentReply)
admin.site.register(PostCommentLike)
admin.site.register(PostVideo)


# admin.site.register(Settings, SingletonModelAdmin)
