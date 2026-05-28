export type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  phoneNumber: string | null;
  email: string | null;
  createDate: string; // ISO timestamp
  sex: string | null;
  birthdate: string; // ISO date
  isActive: boolean;
  pictureId?: number;
  pictureDirectory?: string;
  role: "user" | "admin";
  token: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  username: UserInfo;
  role: string;
  expiryTime: number;
  access_token: string;
};

export type RegisterRequest = {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  phone_number?: string;
  email: string;
  sex: string;
  birthdate?: string;
};

export type UserInfo = {
  userId: number;
  username: string;
  role?: string;
};

export type RecipeBox = {
  recipeId: number;
  name: string;
  addedBy: number;
  rating: number;
  imageDirectory: string;
  authorName: string;
  avatar?: string | null;
  categories?: Array<RecipeDetailCategoryIdDto>;
};

export type RecipePagination = {
  page: number;
  pageSize: number;
  totalPages: number;
  recipeList: Array<RecipeBox>;
};

export type RecipeHistory = {
  recipeList: Array<RecipeBox>
}

export type KitchenUtensilPagination = {
  page: number;
  pageSize: number;
  totalPages: number;
  recipeList: Array<RecipeBox>;
};

export type KithcenUtensilBox = {
  kitchenUtensilId: number;
  name: string;
  imageDirectory: string;
};

export type ChangePasswordDTO = {
  username: string;
  oldPassword: string;
  newPassword: string;
};

export type Ingredient = {
  ingredientsId: number;
  name: string;
  categoryId: number;
  categoryName: string;
  pictureDirectory: string;
};
export type RecipeBoxDTO = {
  id: number;
  name: string;
  addedBy: string;
  rating: number;
  imageUrl: string;
};

export type Recipe = {
  recipeId: number;
  name: string;
  description?: string | null;
  cookingTime: number;
  servingSize: number;
  categories: Category[];
  ingredients: Ingredient[];
  kitchenUtensils: KitchenUtensil[];
  imageDirectory: string;
};
export type KitchenUtensil = {
  kitchenUtensilId: number;
  name: string;
  pictureDirectory: string;
  categoryId: number;
};

export type Review = {
  username: string;
  image: string;
  content: string;
  rating: number;
  date: Date;
};

export type Wishlist = {
  id: number;
};

export type ShoppingList = {};

export type Category = {
  categoryId: number;
  name: string;
  description: string | null;
  ingredientCategory: boolean;
  kitchenCategory: boolean;
  pictureDirectory?: string | null;
  isActive: boolean;
};

export type Image = {};

export type CreateRecipeRequestDto = {
  name: string;
  description?: string | null;
  cookingTime?: number;
  servingSize?: number;
  ingredients: Array<RecipeIngredient>;
  categories: Array<RecipeCategoryInfoDto>;
  kitchenUtensils: Array<RecipeKitchenUtensilsInfoDto>;
};



export type RecipeIngredient = {
  ingredientsId: number | null;
  quantity: string;
};

export type RecipeStepInfo = {
  recipeStepId: number | null;
  name: string;
  description: string;
  imageUrl?: string;
};

export type RecipeCategoryInfoDto = {
  categoriesId: number | null;
};

export type RecipeKitchenUtensilsInfoDto = {
  kitchenUtensilId: number | null;
};

//Recipe Detail
export type RecipeDetailIngredientListDto = {
  id: number;
  name?: string;
  measurementUnit?: string;
  quantity?: number;
  pictureDirectory?: string;
};

export type RecipeDetailCategoryIdDto ={
  categoriesId: number;
}
export type RecipeDetailCategoryListDto = {
  categoriesId: number;
  name?: string;
  description?: string;
};

export type RecipeDetailUtensilListDto = {
  kitchenUtensilId: number;
  name?: string;
};

export type RecipeDetailStepListDto = {
  recipeStepId: number;
  name?: string;
  description?: string;
  imageUrl?: string;
  recipeId: number;
};

export type RecipeDetailCompleteDto = {
  recipeId: number;
  name?: string;
  description?: string;
  cookingTime?: number;
  servingSize?: number;
  rating?: number | 0;
  username: string;
  avatar?: string | null;
  pictureDirectory?: Array<string>;
  ingredients?: Array<RecipeDetailIngredientListDto>;
  categories?: Array<RecipeDetailCategoryListDto>;
  kitchenUtensils?: Array<RecipeDetailUtensilListDto>;
  recipeSteps?: Array<RecipeDetailStepListDto>;
};

export type UserWithToken = User & { token: string };

export type KitchenUtensilCategoryDto = {
  categoriesId: number | null;
};

export type RecipeStepInfoUpdate = {
  name: string;
  description: string;
  imageUrl?: string;
};

export type CategoryBoxDto = {
  name: string;
  categoryId: number;
  description?: string | undefined;
  pictureDirectory?: string | undefined;
};

export type CategoryPagination = {
  page: number;
  pageSize: number;
  totalPages: number;
  categoryList: Array<CategoryBoxDto>;
};

export type ChangePasswordDto = {
  username: string;
  password: string;
}

export type WishlistDto = {
  recipeId: number;
}

export type IngredientCategoryDto = {
  categoriesId: number | null;
}

export type UpdateStepRequest = {
  recipeId: number;
  stepId: number;
}

export type UserRecipeHistory = {
  id: number;
  userId: number;
  recipeId: number;
  cookedAt: string;
  ratingGiven?: number | null;
  note?: string | null;
};