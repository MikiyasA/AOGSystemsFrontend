import { createTheme, rem } from '@mantine/core';

export const myCustomTheme = createTheme({
    // primaryColor: 'red',
    
    components: {
        Button: {
            styles: {
                root: {
                    backgroundColor: "green",
                    padding: 5,
                }
            }
        },
        Table: {
            styles: {
                root: {
                    padding: 2,
                }
            }
        },
        Link: {
            classNames:{
                backgroundColor: 'red',
            },
            styles: {
                root: {
                    textDecoration: 'none',
                    color: 'red'
                    
                },
                
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