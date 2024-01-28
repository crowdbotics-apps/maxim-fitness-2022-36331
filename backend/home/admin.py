from django.contrib import admin

# Register your models here.
from django.http import HttpResponseRedirect
from django.utils.safestring import mark_safe

from .models import Product, ProductUnit, Food, Meal, FoodItem, Category, Recipe, \
    RecipeItem, Post, Comment, Form, QuestionType, Question, Answer, UserProgram, CaloriesRequired, Like, \
    ConsumeCalories, ReportAPost, BlockUser, PostImage, PostCommentReply, PostCommentLike, PostVideo, ReportAComment, \
    ReportCommentReply, MealHistory, MealTime
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
    # inlines = [FoodItemInline]


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
admin.site.register(MealHistory)
admin.site.register(MealTime)

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
    list_display = ["id", "food","meal_time", "meal_history", "created"]


class CaloriesRequiredAdmin(admin.ModelAdmin):
    list_display = ['user', 'calories', 'protein', 'carbs', 'fat', 'created']


class ConsumeCaloriesAdmin(admin.ModelAdmin):
    list_display = ['user', 'calories', 'protein', 'carbs', 'fat', 'created']


class ReportAPostAdmin(admin.ModelAdmin):
    list_display = ["user", "post", "post_owner", "comment", "reason", "resolved", "created"]

    def post_owner(self, obj):
        return obj.post.user.username if obj.post else None

    post_owner.short_description = "Post Owner"

    def response_change(self, request, obj):
        if "resolve" in request.POST:
            obj.resolved = True
            obj.save()
            self.message_user(request, "This post is know resolve")
            # return HttpResponseRedirect(".")
        return super().response_change(request, obj)


class BlockUserAdmin(admin.ModelAdmin):
    list_display = ["requested_user", "blocked_user", "created"]


class PostImageVideoAdmin(admin.ModelAdmin):
    list_display = ["id", "post", "image", "created"]


class ReportCommentReplyAdmin(admin.ModelAdmin):
    list_display = ["id", "comment_reply", "user", "reason", "created"]


class PostCommentReplyAdmin(admin.ModelAdmin):
    list_display = ["id", "comment", "user", "content", "created"]


class PostCommentLikeAdmin(admin.ModelAdmin):
    list_display = ["id", "comment", "user", "comment_reply"]


class ReportACommentAdmin(admin.ModelAdmin):
    list_display = ["id", "comment", "user", "reason", "created"]


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
admin.site.register(ReportCommentReply, ReportCommentReplyAdmin)
admin.site.register(PostCommentReply, PostCommentReplyAdmin)
admin.site.register(PostCommentLike, PostCommentLikeAdmin)
admin.site.register(PostVideo)
admin.site.register(ReportAComment, ReportACommentAdmin)

# admin.site.register(Settings, SingletonModelAdmin)
