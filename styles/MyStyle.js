import { StyleSheet } from "react-native";

export const MyStyles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'center',
  },
  container: {
    flex: 1,
  },
  header: {
    justifyContent: "center",
    height: 65,
    backgroundColor: "#e1c4b2",
  },
  arrowHeader: {
    flexDirection: "row",
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 65,
    backgroundColor: "#B6917B",
  },
  arrowIcon: {
    paddingVertical: 8
  },
  textHeader: {
    fontSize: 30,
    color: "black",
  },
  item: {
    backgroundColor: "#fff",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemHeader: {
    fontSize: 20,
    fontFamily: "ComfortaaBold",
  },
  itemText: {
    fontSize: 16,
    fontFamily: "ComfortaaBold",
    color: "#493628",
    paddingLeft: 7,
  },
  itemTime: {
    position: "absolute",
    fontFamily: "ComfortaaBold",
    right: 0,
    top: -2,
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
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "ComfortaaBold",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#fd7444",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  deleteButton: {
    position: "absolute",
    bottom: 8, 
    right: 8,
  },
  modal: {
    flex: 1,
    padding: 20,
  },
  petItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
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
    fontFamily: "ComfortaaBold",
    paddingVertical: 5,
    fontSize: 16,
    color: '#000',
  },
  label: {
    fontSize: 14,
    fontFamily: "ComfortaaBold",
    color: '#000',
    marginTop: 10,
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
  },
  petItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
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
