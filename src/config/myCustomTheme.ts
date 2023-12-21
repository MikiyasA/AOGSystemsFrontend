import { createTheme, rem } from '@mantine/core';

export const myCustomTheme = createTheme({
    // primaryColor: 'red',
    
    components: {
        Button: {
            classNames:{

            },
            styles:{
                root: {
                    backgroundColor: 'green',
                    padding: 5,
                    // '&:hover': {
                    //     backgroundColor: 'darkblue',
                    // },
                },
            }
        },
        Table: {
            styles: {
                root: {
                    padding: 2,
                }
            }
        }
    }
    
//   components: {
//     // Button: {
//     //     styles: {
            
//     //     },
//     //     classNames:{
            
//     //     }
//     //   root: {
//     //     backgroundColor: 'red', 
//     //     padding: '10px 20px',
//     //     borderRadius: '8px',

//     //     '&:hover': {
//     //       backgroundColor: 'darkblue',
//     //     },

//         // Add more custom styles as needed
//       },
    // },
//   },
})