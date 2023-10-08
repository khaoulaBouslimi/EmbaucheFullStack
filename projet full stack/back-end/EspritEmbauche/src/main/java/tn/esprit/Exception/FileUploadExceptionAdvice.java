package tn.esprit.Exception;




public class FileUploadExceptionAdvice extends RuntimeException {


    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public FileUploadExceptionAdvice(String message) {
        super(message);
    }
	

    public FileUploadExceptionAdvice() {
		super();
		// TODO Auto-generated constructor stub
	}


	public FileUploadExceptionAdvice(Throwable cause) {
		super(cause);
		// TODO Auto-generated constructor stub
	}


	public FileUploadExceptionAdvice(String message, Throwable cause) {
        super(message, cause);
    }
}