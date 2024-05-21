import style from "./modal.css";


const Modal = ({children, onOk, onClose, active, title}) => {
    return (
      <>
        {active &&
        <div>
            <div className='back' onClick={onClose}></div>
            <div className='container'>
                <div className='header'>
                    <h1 className='title fs-2'>{title}</h1>
                    <button className='close btn btn-danger' onClick={onClose}>X</button>
                </div>
                <hr />
                {children}
                <hr />
                <div className='footer'>
                    <button className='btn btn-danger' onClick={onClose}>Cancel</button>
                    <button className='btn btn-primary' onClick={() => onOk && onOk()}>Ok</button>
                </div>
            </div>
        </div>
        }
      </>
    );
}

export default Modal;