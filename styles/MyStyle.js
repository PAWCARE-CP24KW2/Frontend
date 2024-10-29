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
    justifyContent: "flex-end",
    marginTop: 45,
    marginBottom: 15,
  },
  icon: {
    marginRight: 12
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
    backgroundColor: "#493628",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#fd7444",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
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
