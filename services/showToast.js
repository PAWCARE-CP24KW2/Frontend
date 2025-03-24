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

export function showAddPetToast(status) {
    if (status == 'success') {
        Toast.show({
            type: 'success',
            text1: `Add successful`,
            text2: 'You added successfully ✅'
        });
    }else if (status == 'error') {
        Toast.show({
            type: 'error',
            text1: "Can't add to pet",
            text2: "Failed to add pet ❌"
        });
    }else if (status == 'error name') {
        Toast.show({
            type: 'error',
            text1: "Can't add to pet",
            text2: "Please fill Pet Name ❌"
        });
    }else if (status == 'error weight') {
        Toast.show({
            type: 'error',
            text1: "Can't add to pet",
            text2: "Please fill Weight ❌"
        });
    }else if (status == 'error Date of Birth') {
        Toast.show({
            type: 'error',
            text1: "Can't add to pet",
            text2: "Please fill Date of Birth ❌"
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

export function showDelPetToast(name) {
    Toast.show({
        type: 'info',
        text1: `Delete "${name}" pet`,
        text2: 'Your pet deleted successfully. 🗑️'
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

export function showUpdatePetToast(status) {
    if (status == 'success') {
        Toast.show({
            type: 'success',
            text1: `Updated successful`,
            text2: 'Your pet data updated successfully ✅'
        });
    }else if (status == 'error name') {
        Toast.show({
            type: 'error',
            text1: "Pet Name Cannot be Empty",
            text2: "Failed to update pet data ❌"
        });
    }else if (status == 'error weight') {
        Toast.show({
            type: 'error',
            text1: "Weight Cannot be Empty",
            text2: "Failed to update pet data ❌"
        });
    }else if (status == 'error') {
        Toast.show({
            type: 'error',
            text1: "Can't update pet data",
            text2: "Failed to update pet data ❌"
        });
    }
}

export function showUpdateUserToast(status) {
    if (status == 'success') {
        Toast.show({
            type: 'success',
            text1: `Updated successful`,
            text2: 'Your user data updated successfully ✅'
        });
    }else if (status == 'error') {
        Toast.show({
            type: 'error',
            text1: "Can't update user data",
            text2: "Failed to update user data ❌"
        });
    }
}

export function showCreateUserToast(status) {
    if (status == 'success') {
        Toast.show({
            type: 'success',
            text1: `Sign Up ✅`,
            text2: 'You account was ready.'
        });
    }else if (status == 'error') {
        Toast.show({
            type: 'error',
            text1: "Can't create to user",
            text2: "Failed to create account ❌"
        });
    }else if (status == 'error username already') {
        Toast.show({
            type: 'error',
            text1: "Can't create to user",
            text2: "Username already exists ❌"
        });
    }else if (status == 'error required') {
        Toast.show({
            type: 'error',
            text1: "Can't create user",
            text2: "All fields are required ❌"
        });
    }else if (status == 'error not match') {
        Toast.show({
            type: 'error',
            text1: "Can't create to user",
            text2: "Passwords do not match ❌"
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
            type: 'error',
            text1: `Sign out`,
            text2: ''
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

export function showUploadPhotoToast(status) {
    if (status == 'success') {
        Toast.show({
            type: 'success',
            text1: `Upload successful ✅`,
            text2: `Photo was uploaded.`,
        });
    }else if (status == 'fail') {
        Toast.show({
            type: 'error',
            text1: `Can't Upload`,
            text2: `Failed to upload photo ❌`,
        });
    }else if (status == 'error') {
        Toast.show({
            type: 'error',
            text1: `Can't Upload`,
            text2: `Failed to upload photo ❌`,
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