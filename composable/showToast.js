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