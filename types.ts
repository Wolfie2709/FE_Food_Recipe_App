export type User = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  phone_number: string;
  email: string;
  create_date: string; // ISO timestamp
  sex: string;
  birthdate: string; // ISO date
  is_active: boolean;
  picture_id: number | null;
  role: string;
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

 };
export type RecipeBoxDTO = {
    id: number;
    name: string;
    addedBy: string;
    rating: number;
    imageUrl: string;
};
export type Recipe = {
    id: number;
    name: string;
    cookingTime: number;
    servingSize: number;
 };
export type KitchenUtensils = {
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

export type ShoppingList = {

};

export type Category = {
    
};

export type Image= {

}

