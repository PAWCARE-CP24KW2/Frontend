import { StyleSheet } from "react-native";

export const MyStyles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#B6917B",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 60,
    marginBottom: 30,
  },
  textHeader: {
    fontSize: 30,
    color: "black",
  },
  item: {
    backgroundColor: "#B6917B",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 25,
    paddingBottom: 20,
  },
  itemHeader: {
    fontSize: 20,
  },
  itemText: {
    color: "#493628",
    fontSize: 16,
    paddingLeft: 7,
  },
  itemTime: {
    position: "absolute",
    right: 12,
    top: 12
  },
  input: {
    backgroundColor: "white",
    height: 40,
    margin: 10,
    paddingLeft: 8,
  },
  button: {
    backgroundColor: "#B6917B",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    margin: 10,
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  icon: {
    position: "absolute",
    right: 12, 
  },
  closeButton: {
    backgroundColor: "#fd7444",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    marginHorizontal: 10,
  },
  deleteButton: {
    position: "absolute",
    bottom: 12, 
    right: 12
  },
  modal: {
    flex: 1,
    backgroundColor: "#EACEBE",
    padding: 20,
  },
});
