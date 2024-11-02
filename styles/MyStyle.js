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
  addInput: {
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

  // Add agenda container
  addContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EACEBE',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 20,
    backgroundColor: '#FFF',
  },
  descriptionContainer: {
    height: 49,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 5,
    paddingLeft: 2,
    fontSize: 16,
    color: '#000',
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginTop: 20,
    marginBottom: 5,
    paddingLeft: 4,
  },
  dateContainer: {
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FFF',
  },
  timeContainer: {
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FFF',
    marginTop: 10,
    marginBottom: 20
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  icon: {
    marginHorizontal: 4,
  },
});
