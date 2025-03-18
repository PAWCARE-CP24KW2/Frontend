import Toast from 'react-native-toast-message';

export function showToast(status) {
    if (status == 'success') {
        Toast.show({
            type: 'success',
            text1: 'Agenda Added',
            text2: 'Your agenda item was successfully added. 😻'
        });
    }else if (status == 'error') {
        Toast.show({
            type: 'error',
            text1: "Can't add Agenda",
            text2: "Fields should not be empty. ❌"
        });
    }
}

export function showDelToast(name) {
    Toast.show({
        type: 'info',
        text1: `Delete "${name}" agenda`,
        text2: 'Your agenda deleted successfully. 🗑️'
    });
}

export function showUpdateToast(status) {

    if (status == 'success') {
        Toast.show({
            type: 'info',
            text1: `Update agenda`,
            text2: 'Your agenda Updated successfully. 🔄'
        });
    }else if (status == 'error') {
        Toast.show({
            type: 'error',
            text1: "Can't update Agenda.",
            text2: "Fields should not be empty. ❌"
        });
    }
}

export function showUpdateUserToast(status) {

    if (status == 'success') {
        Toast.show({
            type: 'info',
            text1: `Update User Profile`,
            text2: 'Your user profile Updated successfully. 🔄'
        });
    }else if (status == 'error') {
        Toast.show({
            type: 'error',
            text1: "Can't update User Profile.",
            text2: "Fields should not be empty. ❌"
        });
    }
}

export function showLoginToast(status) {
    if (status == 'success') {
        Toast.show({
            type: 'success',
            text1: `Login successful`,
            text2: 'You logined successfully ✅'
        });
    }else if (status == 'error') {
        Toast.show({
            type: 'error',
            text1: "Can't Login.",
            text2: "Invalid username or password ❌"
        });
    }else if (status == 'error 401') {
        Toast.show({
            type: 'error',
            text1: "Can't Login.",
            text2: "Invalid username or password ❌"
        });
    }else if (status == 'error require') {
        Toast.show({
            type: 'error',
            text1: "Can't Login.",
            text2: "All fields are required ❌"
        });
    }  
}

export function showLogOutToast(status) {
    if (status == 'success') {
        Toast.show({
            type: 'success',
            text1: `Login successful`,
            text2: 'You logined successfully ✅'
        });
    }else if (status == 'error') {
        Toast.show({
            type: 'error',
            text1: "Can't Logout.",
            text2: "Failed to log out ❌"
        });
    }
}

export function showDelUserToast(status) {
    if (status == 'success') {
        Toast.show({
            type: 'success',
            text1: `Delete successful`,
            text2: 'User was Deleted ✅'
        });
    }else if (status == 'error') {
        Toast.show({
            type: 'error',
            text1: "Can't Delete.",
            text2: "Failed to delete user ❌"
        });
    }
}

export function showUploadDocToast(text, action) {
    if (action == 'upload') {
        Toast.show({
            type: 'success',
            text1: `Upload successful`,
            text2: `${text} was uploaded.`,
        });
    }else if (action == 'delete') {
        Toast.show({
            type: 'info',
            text1: `Delete successful`,
            text2: `${text} was deleted.`,
        });
    }
}

export function showUploadProToast(text, action) {
    if (action == 'upload') {
        Toast.show({
            type: 'success',
            text1: `Upload successful ✅`,
            text2: `${text} was uploaded.`,
        });
    }else if (action == 'delete') {
        Toast.show({
            type: 'info',
            text1: `Delete successful 🗑️`,
            text2: `${text} was deleted.`,
        });
    }
}

export function showPostToast(action) {
    if (action == 'success') {
        Toast.show({
            type: 'success',
            text1: `Create successful ✅`,
            text2: `Post was created.`,
        });
    }else if (action == 'fail') {
        Toast.show({
            type: 'error',
            text1: `Create failed ❌`,
            text2: `Please fill in at least one field. (Title or Content)`,
        });
    }else if (action == 'delete') {
        Toast.show({
            type: 'info',
            text1: `Delete successful 🗑️`,
            text2: `Post was deleted.`,
        });
    }else if (action == 'update') {
        Toast.show({
            type: 'success',
            text1: `Update successful 🔄`,
            text2: `Post was updated.`,
        });
    }
}