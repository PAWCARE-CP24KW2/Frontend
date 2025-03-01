import { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';

export const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: 'green', borderLeftWidth: 8 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 18,
        }}
        text2Style={{
          fontSize: 14,
          fontWeight: 500
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: '#f92f60', borderLeftWidth: 8 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 18
        }}
        text2Style={{
          fontSize: 14,
          fontWeight: 500
        }}
      />
    ),
    info: (props) => (
        <InfoToast
          {...props}
          style={{ borderLeftColor: '#eb463b', borderLeftWidth: 8,  }}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          text1Style={{
            fontSize: 18,
          }}
          text2Style={{
            fontSize: 14,
            fontWeight: 500
          }}
        />
      ),
  };