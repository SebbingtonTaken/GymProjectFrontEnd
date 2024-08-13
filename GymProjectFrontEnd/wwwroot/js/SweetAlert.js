// Custom Dark Theme Styles
const darkThemeStyles = `
    .swal2-popup {
        background-color: #333;
        color: #fff;
        border: 1px solid #444;
    }
    .swal2-title {
        color: #fff;
    }
    .swal2-html-container {
        color: #ddd;
    }
    .swal2-confirm {
        background-color: #444;
        color: #fff;
    }
    .swal2-cancel {
        background-color: #555;
        color: #fff;
    }
    .swal2-confirm:hover, .swal2-cancel:hover {
        background-color: #666;
    }
    .swal2-input, .swal2-textarea {
        background-color: #555;
        color: #fff;
        border: 1px solid #666;
    }
    .swal2-icon {
        color: #fff;
    }
`;

// Append the custom styles to the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = darkThemeStyles;
document.head.appendChild(styleSheet);
