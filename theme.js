import { StyleSheet } from "react-native";

export const colors = {
  primary: "#FF6B00", // Figma primary
  secondary: "#0066FF", // optional secondary
  textDark: "#1A1A1A",
  textLight: "#7A7A7A",
  background: "#FDFDFD",
  dark: "#303030",
  light: "#FFF",
  uikitPrimary: "#E23E3E",
};

export const fonts = {
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semiBold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const homeStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  section: { padding: spacing.md },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: colors.textDark,
  },
  link: { color: colors.primary, fontSize: 14, fontFamily: fonts.medium },
  creatorRow: { flexDirection: "row", gap: spacing.md },
  creator: { alignItems: "center", marginRight: spacing.md },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  creatorName: {
    marginTop: spacing.xs,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textDark,
  },
  recipeRow: { flexDirection: "row", gap: spacing.md },
  recipeCard: { width: 120, marginRight: spacing.md },
  recipeImage: { width: "100%", height: 80, borderRadius: 8 },
  recipeTitle: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.textDark,
    marginTop: spacing.xs,
  },
  recipeAuthor: { fontSize: 12, color: colors.textLight },
  recipeTime: {
    fontSize: 12,
    color: colors.textDark,
    fontFamily: fonts.medium,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  category: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    color: colors.primary,
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  categoryActive: { backgroundColor: colors.primary, color: colors.background },
  searchBar: {
    borderWidth: 1,
    borderColor: colors.textLight,
    borderRadius: 8,
    padding: spacing.sm,
  },
  searchPlaceholder: {
    color: colors.textLight,
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  heroText: {
    fontSize: 20,
    fontFamily: fonts.semiBold,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textLight,
    textAlign: "left",
  },
  statCard: {
    flex: 1,
    margin: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  statTitle: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.textDark,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  statValue: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.textDark,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  statSubtitle: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textLight,
    textAlign: "center",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: spacing.md,
  },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    marginVertical: 6,
  },
  linkText: {
    color: "#E23E3E",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
});

export const onboardingStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: { position: "absolute", width: "100%", height: "100%" },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 400,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  header: {
    position: "absolute",
    top: 60,
    left: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    fontSize: 20,
    color: colors.background,
    marginRight: spacing.sm,
  },
  headerText: {
    color: colors.background,
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
  textContainer: { marginTop: 450, alignItems: "center" },
  title: {
    color: colors.background,
    fontSize: 48,
    fontFamily: fonts.bold,
    textAlign: "center",
  },
  subtitle: {
    color: colors.background,
    fontSize: 16,
    marginTop: spacing.sm,
    textAlign: "center",
    fontFamily: fonts.regular,
  },
  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
});

export const authStyles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.md,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  title: {
    color: colors.background,
    fontSize: 18,
    marginBottom: spacing.md,
    textAlign: "center",
    fontFamily: fonts.semiBold,
  },
  label: {
    color: colors.background,
    marginBottom: spacing.xs,
    fontFamily: fonts.regular,
  },
  input: {
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  link: {
    color: colors.background,
    textAlign: "center",
    marginTop: spacing.md,
    fontFamily: fonts.medium,
  },
});

export const ManagementStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    margin: 20,
    marginTop: 70,
    // justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.semiBold,
    textAlign: "center",
    // marginTop: spacing.lg,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  searchBar: {
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.textDark,
    backgroundColor: colors.background,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginVertical: spacing.md,
  },
  searchText: {
    fontSize: 14,
    flex: 1,
    color: colors.textDark,
    fontFamily: fonts.regular,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderColor: colors.textDark,
    height: 43,
  },
  tableHeaderText: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.textDark,
    paddingHorizontal: 15,
  },
  tableHeaderTextId: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: "#000000",
    borderStyle: "solid",
  },
  tableHeaderTextProducts: {
    flex: 4,
  },
  TabHeaderInner: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    borderBottomWidth: 1,
    borderColor: colors.textLight,
  },
  tableCellId: {
    flex: 1,
  },
  tableCellProduct: {
    flex: 4,
  },
  ProductCell: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  ImageContent: {
    width: 60,
    height: 60,
  },
  ProductInformation: {
    marginLeft: spacing.md,
  },
  tableCellText: {
    fontSize: 13,
    color: colors.textDark,
    fontFamily: fonts.regular,
  },
  section: { padding: spacing.md },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    marginVertical: 6,
  },
  linkText: {
    color: "#E23E3E",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },

  // Recipe table list
  boxListTable: {
    background: "#E5E5E5",
    borderWidth: 1,
    borderColor: "#000000",
    borderStyle: "solid",
    width: "100%",
    // height: 500,
    // boxSizing: "border-box",
    flex: 1,
  },

  boxList: {
    paddingVertical: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
  },
});

export const uiKitsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    borderRadius: 50,
  },
  statusBarWrapper: {
    position: "absolute",
    left: 344,
    top: 740,
    width: 415,
    height: 148,
  },
  sectionTitle: {
    position: "absolute",
    left: 344,
    top: 376,
    fontSize: 32,
    fontFamily: "Poppins_600SemiBold",
    color: colors.dark,
  },
  fieldsSection: {
    position: "absolute",
    left: 344,
    top: 20,
  },
  fieldsTitle: {
    fontSize: 48,
    fontFamily: "Poppins_700Bold",
    color: colors.light,
  },
  fieldsSubtitle: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: colors.light,
    marginTop: 10,
  },
});

export const fieldStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.uikitsPrimary,
    borderRadius: 50,
    padding: 20,
  },
  header: {
    backgroundColor: colors.light,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
    color: colors.light,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: colors.light,
  },
  fieldWrapper: {
    marginVertical: 10,
  },
  defaultField: {
    borderWidth: 1,
    borderColor: "#C1C1C1",
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    padding: 12,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: colors.dark,
  },
  focusField: {
    borderWidth: 1,
    borderColor: colors.uikitPrimary,
    backgroundColor: colors.light,
    borderRadius: 10,
    padding: 12,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: colors.dark,
  },
  filledField: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: colors.light,
    borderRadius: 10,
    padding: 12,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: colors.dark,
  },
  filledFocusField: {
    borderWidth: 1,
    borderColor: "#E23E3E",
    backgroundColor: colors.light,
    borderRadius: 10,
    padding: 12,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: colors.dark,
  },
  disabledField: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: colors.light,
    borderRadius: 10,
    padding: 12,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#C1C1C1",
  },
});

export const buttonStyles = StyleSheet.create({
  base: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  large: { paddingVertical: 16, paddingHorizontal: 32 },
  small: { paddingVertical: 8, paddingHorizontal: 16 },

  // Variants
  primary: { backgroundColor: colors.uikitPrimary },
  secondary: {
    backgroundColor: "#F9D8D8",
    borderWidth: 1,
    borderColor: "#9E2B2B",
  },
  textButton: { backgroundColor: "transparent" },

  // States
  disabled: { backgroundColor: "#D9D9D9" },
  pressedPrimary: { backgroundColor: "#9E2B2B" },
  pressedSecondary: { backgroundColor: "#9E2B2B" },
  pressedText: { opacity: 0.6 },

  // Text styles
  text: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  primaryText: { color: colors.light },
  secondaryText: { color: "#9E2B2B" },
  textVariant: { color: colors.uikitPrimary },
});

export const iconStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    borderRadius: 50,
    padding: 20,
  },
  header: {
    backgroundColor: colors.dark,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
    color: colors.light,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: colors.light,
  },
  iconRow: {
    flexDirection: "row",
    gap: 16,
    marginVertical: 20,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C1C1C1",
  },
  sectionLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: colors.uikitPrimary,
  },
});

export const navBarStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    borderRadius: 50,
    padding: 20,
  },
  header: {
    backgroundColor: colors.uikitPrimary,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
    color: colors.light,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: colors.light,
  },
  menuLabel: {
    fontSize: 32,
    fontFamily: "Poppins_600SemiBold",
    color: colors.dark,
    marginBottom: 20,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.light,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C1C1C1",
    paddingVertical: 16,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapperActive: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.uikitPrimary,
    borderRadius: 20,
  },
});

export const tabbingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    borderRadius: 50,
    padding: 20,
  },
  header: {
    backgroundColor: colors.dark,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
    color: colors.light,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: colors.light,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  tab: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: colors.light,
  },
  activeTab: {
    backgroundColor: colors.dark,
  },
  tabText: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
  },
  activeTabText: {
    color: colors.light,
  },
  inactiveTabText: {
    color: "#EE8B8B",
  },
});

export const RecipeFormStyles = StyleSheet.create({
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginVertical: 4,
    borderRadius: 6,
    flex: 1,
    backgroundColor: "#fff", // ensure contrast
    color: "#000", // make typed text visible
    fontSize: 16, // optional: improve readability
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  recipeImage: { width: 200, height: 200, marginVertical: 10, borderRadius: 8 },
});

export const RecipeStepStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  stepRow: { marginVertical: 10 },
  stepText: { fontSize: 14, marginBottom: 6 },
  stepImage: { width: 100, height: 100, borderRadius: 8, marginBottom: 6 },
});

export const nBarStyles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#C1C1C1",
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    padding: 10,
  },
});

export const RecipeDetailStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerButton: { width: 24, height: 24 },
  RecipeVisualBlock: { marginBottom: 16 },
  RecipeName: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  RecipePicture: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    borderRadius: 16,
  },
  RecipeRating: { fontSize: 14, color: "#3c3c3c" },
  RecipeAuthor: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  RecipeAuthorAvatar: { width: 50, height: 50, borderRadius: 25 },
  RecipeAuthorName: { marginLeft: 10 },
  RecipeDetailPageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "red",
    borderRadius: 8,
    color: "white",
    fontWeight: "600",
  },
  InfoBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  InfoCard: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
  },
  InfoLabel: {
    fontSize: 14,
  },
  InfoDetail: { fontSize: 20, fontWeight: "600" },
  DescriptionCard: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
    minHeight: 200,
  },
  DescriptionLabel: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: "auto",
  },
  DescriptionContent: {
    marginTop: 8,
    textAlign: "justify",
    lineHeight: 20,
    fontSize: 16,
    color: "#3c3c3c",
    marginHorizontal: "auto",
  },
  CardList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  CardListItem: { flexDirection: "row", alignItems: "center" },
  CardListItemImage: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 12,
  },
  CardListItemName: { fontSize: 16, fontWeight: "600" },
  StepButton: {
    paddingVertical: 15,
    paddingHorizontal: 32,
    marginTop: 16,
    textAlign: "center",
  },
});


export const profilePageStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  content: { flex: 1, alignItems: "center", padding: 20 },
  header: { flexDirection: "row", padding: 16, alignItems: "center" },
  headerInfo: { flex: 1, marginLeft: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  avatarPlaceholder: {
    backgroundColor: "#E23E3E",
    justifyContent: "center",
    alignItems: "center",
  },
  username: { fontSize: 20, fontWeight: "700", color: "#303030" },
  infoBox: { flexDirection: "row", marginBottom: 8, width: "100%" },
  label: { fontWeight: "600", color: "#787A7C", marginRight: 8 },
  value: { color: "#303030" },
  message: { fontSize: 18, color: "#787A7C", marginTop: 40, textAlign: "center" },
  settings: { width: 30,
    height: 30,
    borderRadius: 10,
    position: "absolute",
    top: 16,
    right: 16 },
  bio: { fontSize: 14, color: "#787A7C", marginTop: 4 },

  statsRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 20 },
  statBox: { alignItems: "center" },
    statLabel: { color: "#A9A9A9", fontSize: 12 },
    statValue: { color: "#303030", fontSize: 18, fontWeight: "700" },
  
    card: {
      width: 335,
      height: 200,
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 20,
      alignSelf: "center",
      backgroundColor: "#C1C1C1",
    },
    cardImage: { width: "100%", height: "100%" },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)" },
    cardTitle: {
      position: "absolute",
      bottom: 40,
      left: 16,
      color: "#FFF",
      fontSize: 16,
      fontWeight: "600",
    },
    infoRow: { position: "absolute", bottom: 16, left: 16, flexDirection: "row", gap: 12 },
    infoText: { color: "#FFF", fontSize: 12 },
    rating: {
      position: "absolute",
      top: 8,
      left: 8,
      backgroundColor: "rgba(48,48,48,0.3)",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    ratingText: { color: "#FFF", fontWeight: "600" },
  
    bottomNav: {
      height: 60,
      borderTopWidth: 1,
      borderColor: "#DDD",
      justifyContent: "center",
      alignItems: "center",
    },
    
});

export const RecipeStepListStyles = StyleSheet.create({
  infoBox: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#FFF",
  },
  stepTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  stepDescription: { fontSize: 16, color: "#333" },
  finishButton: {
    backgroundColor: "#E23E3E",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  finishButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  thumbnail: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 12,
  },
  thumbnailPlaceholder: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#D9D9D9",
    marginRight: 12,
  },
});
