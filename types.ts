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
  birthdate: string ; // ISO date
  isActive: boolean;
  pictureId: number;
  role: string;
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
};

export type RecipePagination = {
  page: number;
  pageSize: number;
  totalPages: number;
  recipeList: Array<RecipeBox>;
};

export type ChangePasswordDTO = {
  username: string;
  oldPassword: string;
  newPassword: string;
};

export type Ingredient = {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  imageUrl: string;
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
  id: number;
  name: string;
  imageUrl: string;
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
  id: number;
  name: string;
  description?: string;
};

export type Image = {};

export type CreateRecipeRequestDto = {
  name: string;
  description?: string | null;
  cookingTime?: number;
  servingSize?: number;
  ingredients: { ingredientId: number; quantity: string }[];
  categories: { categoryId: number }[];
  kitchenUtensils: { utensilId: number }[];
};

export type RecipeIngredient = {
  ingredientsId: number | null;
  quantity: string;
  imageUrl?: string;
};

export type RecipeStepInfo = {
  name: string;
  description: string;
  imageUrl?: string;
};

export type RecipeCategoryInfoDto = {
  CategoriesId: number | null;
};

export type RecipeKitchenUtensilsInfoDto = {
  KitchenUtensilsId: number | null;
}

export type UserWithToken = User & { token: string };
