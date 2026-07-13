import { RecipeFormStyles as styles } from "@/theme";
import { Category, CreateRecipeRequestDto, Ingredient, KitchenUtensil, RecipeCategoryInfoDto, RecipeIngredient, RecipeKitchenUtensilsInfoDto } from "@/types";
import { API_BASE_URL } from "@/utils/apiConfig";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Button from "../ui/button";
import CategoryDropdown from "../ui/categoryDropdown";
import ConfirmDialog from "../ui/confirm-dialog";
import { MinusIcon } from "../ui/figma_Icons";
import Field from "../ui/figma_input_fields";
import { useUser } from "../userContext";

export default function AddNewRecipeForm() {
  const {user} = useUser();
  const { recipeId } = useLocalSearchParams(); // recipeId passed from RecipeManagement
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [serves, setServes] = useState("1");
  const [cookTime, setCookTime] = useState("0");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([
    { ingredientsId: null, quantity: "" },
  ]);
  const [recipeCategories, setRecipeCategories] = useState<RecipeCategoryInfoDto[]>([
    { categoriesId: null },
  ]);
  const [recipeKU, setRecipeKU] = useState<RecipeKitchenUtensilsInfoDto[]>([
    { kitchenUtensilId: null },
  ]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [kitchenUtensils, setKitchenUtensils] = useState<KitchenUtensil[]>([]);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [pictureDirectory, setPictureDirectory] = useState<string | null>(null);
  const router = useRouter();

  // Load available ingredients
  useEffect(() => {
    console.log("Updating recipe with id:", recipeId);
    fetch(`${API_BASE_URL}api/Ingredients/all`, {
      headers: {
        "Authorization": user?.token ? `Bearer ${user.token}` : "",
      },
    })
      .then(async (res) => {
        const raw = await res.text(); // read once
        if (!res.ok) {
          console.error("Failed to load ingredients:", res.status, res.statusText, raw);
          return [];
        }
        if (!raw) {
          console.warn("Ingredients API returned empty response");
          return [];
        }
        try {
          return JSON.parse(raw);
        } catch {
          console.error("Ingredients response was not valid JSON:", raw);
          return [];
        }
      })
      .then((data) => {
        // Normalize: if backend returns a single object, wrap it in an array
        const normalized = Array.isArray(data) ? data : [data];
        setIngredients(normalized);
      })
      .catch((err) => console.error("Error loading ingredients:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}api/Categories/category/pagination?page=1&pageSize=50&type=recipe`, {
      headers: {
        "Authorization": user?.token ? `Bearer ${user.token}` : "",
      },
    })
      .then(async (res) => {
        const raw = await res.text();
        if (!res.ok) {
          console.error("Failed to load categories:", res.status, res.statusText, raw);
          return [];
        }
        if (!raw) {
          console.warn("Categories API returned empty response");
          return [];
        }
        try {
          return JSON.parse(raw);
        } catch {
          console.error("Categories response was not valid JSON:", raw);
          return [];
        }
      })
      .then((data) => {
        // ✅ Extract categoryList
        const list = data?.categoryList || [];
        const normalized = Array.isArray(list) ? list : [list];
        setCategories(normalized);
      })
      .catch((err) => console.error("Error loading Categories:", err));
  }, []);
  
  useEffect(() => {
    console.log("Updating recipe with id:", recipeId);
    fetch(`${API_BASE_URL}api/KitchenUtensils/all`, {
      headers: {
        "Authorization": user?.token ? `Bearer ${user.token}` : "",
      },
    })
      .then(async (res) => {
        const raw = await res.text(); // read once
        if (!res.ok) {
          console.error("Failed to load ingredients:", res.status, res.statusText, raw);
          return [];
        }
        if (!raw) {
          console.warn("Kitchen Utensils API returned empty response");
          return [];
        }
        try {
          return JSON.parse(raw);
        } catch {
          console.error("KitchenUtensils response was not valid JSON:", raw);
          return [];
        }
      })
      .then((data) => {
        // Normalize: if backend returns a single object, wrap it in an array
        const normalized = Array.isArray(data) ? data : [data];
        setKitchenUtensils(normalized);
      })
      .catch((err) => console.error("Error loading ingredients:", err));
  }, []);

  const addIngredientRow = () => {
    setRecipeIngredients([...recipeIngredients, { ingredientsId: null, quantity: "" }]);
  };


  const addCategoryRow = () => {
    setRecipeCategories([...recipeCategories, { categoriesId: null }]);
  };

  const addKitchenUtensilsRow = () => {
    setRecipeKU([...recipeKU, { kitchenUtensilId: null }]);
  };

  const buildRecipePayload = (): CreateRecipeRequestDto | null => {
    const selectedIngredients = recipeIngredients
      .filter((rI) => rI.ingredientsId !== null)
      .map((rI) => ({
        ingredientsId: rI.ingredientsId!,
        quantity: rI.quantity.trim(),
      }));

    const duplicateIngredients = selectedIngredients
      .map((item) => item.ingredientsId)
      .filter((id, idx, arr) => arr.indexOf(id) !== idx);

    if (duplicateIngredients.length > 0) {
      Alert.alert(
        "Duplicate ingredient",
        "Please remove or merge duplicate ingredients before saving."
      );
      return null;
    }

    if (selectedIngredients.some((item) => item.quantity === "")) {
      Alert.alert(
        "Missing quantity",
        "Please enter a quantity for every selected ingredient."
      );
      return null;
    }

    const payload: CreateRecipeRequestDto = {
      name,
      description: description || null,
      servingSize: parseInt(serves, 10),
      cookingTime: parseInt(cookTime, 10),
      ingredients: selectedIngredients,
      categories: recipeCategories
        .filter((rC) => rC.categoriesId !== null)
        .map((rC) => ({ categoriesId: rC.categoriesId! })),
      kitchenUtensils: recipeKU
        .filter((rKU) => rKU.kitchenUtensilId !== null)
        .map((rKU) => ({ kitchenUtensilId: rKU.kitchenUtensilId! })),
    };

    return payload;
  };

  // 🔹 Pick image and upload immediately
const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      // safe fallback to avoid TS issues across expo-image-picker versions
      mediaTypes: (ImagePicker as any).MediaTypeOptions?.Images ?? (ImagePicker as any).MediaType?.Images ?? (ImagePicker as any).MediaTypeOptions ?? "Images",
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setRecipeImage(uri); // always show preview locally
    console.log("Picked recipe image URI:", uri);

    // If there's no recipeId yet (creating new recipe), skip server upload
    if (!recipeId) {
      console.warn("No recipeId present — skipping upload until recipe is created");
      return;
    }

    try {
      const filename = uri.split("/").pop() || `recipe-${recipeId}-${Date.now()}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      const formData = new FormData();
      // append object with uri/name/type — works on Expo
      formData.append("file", { uri, name: filename, type } as any);

      const response = await fetch(
        `${API_BASE_URL}api/Pictures/add-picture-for-recipe-${recipeId}`,
        {
          method: "POST",
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : "",
            // DO NOT set Content-Type here
          },
          body: formData,
        }
      );

      const bodyText = await response.text();
      console.log("Image upload response status:", response.status);
      if (!response.ok) {
        console.error("Recipe image upload failed:", response.status, bodyText);
        Alert.alert("Upload failed", `Status ${response.status}`);
        return;
      }

      // parse and set pictureDirectory when backend returns it
      try {
        const json = bodyText ? JSON.parse(bodyText) : null;
        const dir = json?.pictureDirectory ?? json?.path ?? null;
        if (dir) {
          setPictureDirectory(dir);
          console.log("Set pictureDirectory:", dir);
        }
      } catch (e) {
        // response not JSON — ignore
        console.log("Upload succeeded but response was not JSON");
      }
    } catch (error) {
      console.error("Error uploading recipe image:", error);
      Alert.alert("Upload error", "Could not upload image. See console for details.");
    }
  };
  // 🔹 Save recipe and go to cooking steps
  const goToCookingSteps = async () => {
    const payload = buildRecipePayload();
    if (!payload) return;

    try {
      if (!user?.token) {
        console.error("No token available");
        return;
      }
      const ok = await saveRecipe(payload);
      if (ok) {
        router.push({
          pathname: "./AddCookingSteps",
          params: { recipeId: recipeId.toString() },
        });
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  // Save without navigating
  const saveRecipe = async (payload?: CreateRecipeRequestDto) => {
    try {
      if (!user?.token) {
        console.error("No token available");
        return false;
      }
      if (!recipeId) {
        console.error("No recipeId available to save");
        return false;
      }

      const body = payload
        ? JSON.stringify(payload)
        : (() => {
            const generatedPayload = buildRecipePayload();
            if (!generatedPayload) return null;
            return JSON.stringify(generatedPayload);
          })();

      if (!body) {
        return false;
      }

      const response = await fetch(
        `${API_BASE_URL}api/Recipes/update/complete-recipe-info/${recipeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body,
        }
      );

      if (!response.ok) {
        const rawError = await response.text();
        console.error("Recipe save failed:", response.status, rawError);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Error saving recipe:", err);
      return false;
    }
  };

  const [confirmVisible, setConfirmVisible] = useState(false);

  const deleteRecipe = async () => {
    try {
      if (!user?.token) {
        console.error("No token available");
        return false;
      }
      if (!recipeId) {
        console.error("No recipeId available to delete");
        return false;
      }
      const res = await fetch(`${API_BASE_URL}api/Recipes/soft/recipe-${recipeId}`, {
        method: "DELETE",
        headers: { Authorization: user?.token ? `Bearer ${user.token}` : "" },
      });
      if (!res.ok) {
        console.error("Delete failed");
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error deleting recipe:", err);
      return false;
    }
  };

  const confirmExit = () => {
    setConfirmVisible(true);
  };

  const handleSaveAndExit = async () => {
    const ok = await saveRecipe();
    setConfirmVisible(false);
    if (ok) router.back();
  };

  const handleDeleteAndExit = async () => {
    const ok = await deleteRecipe();
    setConfirmVisible(false);
    if (ok) router.back();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={styles.header}>Create Recipe</Text>
        <Button title="Cancel" variant="secondary" size="small" onPress={confirmExit} />
      </View>
      <ConfirmDialog
        visible={confirmVisible}
        title="Save changes"
        message="Do you want to save before exiting?"
        confirmLabel="Yes (Save)"
        destructiveLabel="No (Delete)"
        onConfirm={handleSaveAndExit}
        onDestructive={handleDeleteAndExit}
        onCancel={() => setConfirmVisible(false)}
      />

      {/* Recipe Image */}
      <Text style={styles.sectionTitle}>Recipe Image</Text>
      <TouchableOpacity onPress={pickImage}>
        {recipeImage ? (
          <Image source={{ uri: recipeImage }} style={styles.recipeImage} />
        ) : (
          <View style={[
            styles.recipeImage,
            { justifyContent: "center", alignItems: "center", backgroundColor: "#eee" }
          ]}>

            <Text>Tap to select an image</Text>
          </View>

        )}
      </TouchableOpacity>

      {/* Recipe Name */}
      <Text>Recipe Name:</Text>
      <Field
        value={name}
        onChangeText={setName}
        placeholder="Enter recipe name"
      />

      {/* Description */}
      <Text>Description:</Text>
      <Field
        value={description}
        onChangeText={setDescription}
        placeholder="Enter recipe description"
        multiline
      />
      {/* Serves */}
      <Text>Serves:</Text>
      <Field
        keyboardType="numeric"
        value={serves}
        editable={false}
        placeholder="Enter serving size"
      />

      {/* Cook Time */}
      <Text>Cook Time (minutes):</Text>
      <Field
        keyboardType="numeric"
        value={cookTime}
        onChangeText={setCookTime}
        placeholder="Enter cook time"
      />

      {/* Ingredients */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {recipeIngredients.map((item, index) => (
        <View key={index} style={styles.ingredientRow}>
          <Picker
            selectedValue={item.ingredientsId ?? ""}
            style={{ flex: 1 }}
            onValueChange={(val) => {
              const updated = [...recipeIngredients];
              updated[index].ingredientsId = val === "" ? null : Number(val);
              setRecipeIngredients(updated);
            }}
          >
            <Picker.Item label="Select ingredient..." value="" />
            {ingredients.map((ing) => (
              <Picker.Item
                key={ing.ingredientsId}
                label={ing.name}
                value={ing.ingredientsId}
              />
            ))}
          </Picker>

          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Quantity (e.g. 250gr)"
            value={item.quantity}
            onChangeText={(val) => {
              const updated = [...recipeIngredients];
              updated[index].quantity = val;
              setRecipeIngredients(updated);
            }}
          />

          {/* Price calculation */}
          {item.ingredientsId && item.quantity && (
            <View style={{ marginLeft: 8, justifyContent: "center" }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: "#333" }}>
                {(() => {
                  const selectedIng = ingredients.find(
                    (ing) => ing.ingredientsId === item.ingredientsId
                  );
                  const quantityNum = parseFloat(item.quantity) || 0;
                  const price = selectedIng?.price || 0;
                  const total = quantityNum * price;
                  return total.toLocaleString();
                })()} vnd
              </Text>
            </View>
          )}

          {/* Delete row button */}
          <TouchableOpacity
            onPress={() => {
              const updated = recipeIngredients.filter((_, i) => i !== index);
              setRecipeIngredients(updated);
            }}
            style={{ marginLeft: 8 }}
          >
            <MinusIcon size={20} color="#E23E3E" />
          </TouchableOpacity>

          {item.ingredientsId && (
            <Image
              source={{
                uri:
                  ingredients.find((ing) => ing.ingredientsId === item.ingredientsId)
                    ?.pictureDirectory || "",
              }}
              style={{ width: 40, height: 40 }}
            />
          )}
        </View>
      ))}
      <Button title="Add new ingredient" onPress={addIngredientRow} />

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      {recipeCategories.map((item, index) => (
  <CategoryDropdown
    key={index}
    label={`Category ${index + 1}`}
    selectedCategoryId={item.categoriesId}
    onSelect={(val) => {
      const updated = [...recipeCategories];
      updated[index].categoriesId = val;
      setRecipeCategories(updated);
    }}
    type="recipe"
  />
))}
      <Button title="Add new category" onPress={addCategoryRow} />

      {/* Kitchen Utensils */}
      <Text style={styles.sectionTitle}>Kitchen Utensils</Text>
      {recipeKU.map((item, index) => (
        <View key={index} style={styles.ingredientRow}>
          <Picker
            selectedValue={item.kitchenUtensilId ?? ""}
            style={{ flex: 1 }}
            onValueChange={(val) => {
              const updated = [...recipeKU];
              updated[index].kitchenUtensilId = val === "" ? null : Number(val);
              setRecipeKU(updated);
            }}
          >
            <Picker.Item label="Select utensils..." value="" />
            {kitchenUtensils.map((ku) => (
              <Picker.Item
                key={ku.kitchenUtensilId}
                label={ku.name}
                value={ku.kitchenUtensilId}
              />
            ))}
          </Picker>

        </View>
      ))}
      <Button title="Add new utensil" onPress={addKitchenUtensilsRow} />

      <Button title="Add cooking steps" onPress={goToCookingSteps} />
    </ScrollView>
  );
}
//