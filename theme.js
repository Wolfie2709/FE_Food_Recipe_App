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
