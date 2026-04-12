 // styles.js
import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  section: { padding: 16 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#303030" },
  link: { color: "#E23E3E", fontSize: 14, fontWeight: "500" },
  creatorRow: { flexDirection: "row", gap: 12 },
  creator: { alignItems: "center", marginRight: 12 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  creatorName: { marginTop: 4, fontSize: 12, fontWeight: "500", color: "#303030" },
  recipeRow: { flexDirection: "row", gap: 12 },
  recipeCard: { width: 120, marginRight: 12 },
  recipeImage: { width: "100%", height: 80, borderRadius: 8 },
  recipeTitle: { fontSize: 14, fontWeight: "600", color: "#303030", marginTop: 4 },
  recipeAuthor: { fontSize: 12, color: "#A9A9A9" },
  recipeTime: { fontSize: 12, color: "#303030", fontWeight: "500" },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  category: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: "#E23E3E", color: "#E23E3E", fontSize: 12, fontWeight: "500" },
  categoryActive: { backgroundColor: "#E23E3E", color: "#fff" },
  searchBar: { borderWidth: 1, borderColor: "#D9D9D9", borderRadius: 8, padding: 10 },
  searchPlaceholder: { color: "#C1C1C1", fontSize: 14 },
  heroText: { fontSize: 20, fontWeight: "600", color: "#303030", marginBottom: 8 },
});

export const onboardingStyles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#FFF", alignItems: "center", justifyContent: "center" },
  backgroundImage: { position: "absolute", width: "100%", height: "100%" },
  overlay: { position: "absolute", bottom: 0, width: "100%", height: 400, backgroundColor: "rgba(0,0,0,0.4)" },
  header: { position: "absolute", top: 60, left: 40, flexDirection: "row", alignItems: "center" },
  headerIcon: { fontSize: 20, color: "#FFF", marginRight: 8 },
  headerText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  textContainer: { marginTop: 450, alignItems: "center" },
  title: { color: "#FFF", fontSize: 48, fontWeight: "700", textAlign: "center" },
  subtitle: { color: "#FFF", fontSize: 16, marginTop: 10, textAlign: "center" },
  button: { marginTop: 40, backgroundColor: "#E23E3E", paddingVertical: 14, paddingHorizontal: 40, borderRadius: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 4 },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});

export const authStyles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  overlay: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "rgba(0,0,0,0.4)" },
  title: { color: "#fff", fontSize: 18, marginBottom: 20, textAlign: "center" },
  label: { color: "#fff", marginBottom: 5 },
  input: { backgroundColor: "#D9D9D9", borderRadius: 8, padding: 12, marginBottom: 15 },
  link: { color: "#fff", textAlign: "center", marginTop: 15 },
});
