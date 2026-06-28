function Button({ 
    children, 
    type = "submit", 
    className = "", 
    onClick, 
    disabled 
}) {


  const isDanger =
    className.includes("btn-danger") ||
    className.includes("danger");


  const isSecondary =
    className.includes("btn-secondary") ||
    className.includes("secondary") ||
    className.includes("outline");



  const getButtonStyles = () => {


    if (isDanger) {

      return `
        background: rgba(239, 68, 68, 0.1) !important;
        color: #ef4444 !important;
        border: 1px solid rgba(239, 68, 68, 0.2) !important;
      `;

    }


    if (isSecondary) {

      return `
        background: var(--bg-main) !important;
        color: var(--text-main) !important;
        border: 1px solid var(--border-color) !important;
      `;

    }


    return `
      background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
      color: #ffffff !important;
      border:none !important;
    `;

  };



  return (

    <button

      type={type}

      className={`modern-action-trigger ${className}`}

      onClick={onClick}

      disabled={disabled}

    >


      <style>

      {`

      .modern-action-trigger {

        ${getButtonStyles()}

        padding:10px 20px !important;

        border-radius:10px !important;

        font-size:0.88rem !important;

        font-weight:600 !important;

        cursor:pointer !important;

        display:inline-flex !important;

        align-items:center !important;

        justify-content:center !important;

        gap:8px !important;

        font-family:'Inter',system-ui,sans-serif !important;

        transition:all .2s ease !important;

      }



      .modern-action-trigger:hover:not(:disabled){

        transform:translateY(-2px)!important;

      }



      .modern-action-trigger:disabled{

        opacity:.5 !important;

        cursor:not-allowed !important;

      }


      `}

      </style>


      {children}


    </button>

  );

}


export default Button;