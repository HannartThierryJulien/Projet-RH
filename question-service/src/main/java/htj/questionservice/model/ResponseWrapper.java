package htj.questionservice.model;

public class ResponseWrapper<T> {

    private T data;
    private String message;

    public ResponseWrapper(T data, String message) {
        this.data = data;
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public String getMessage() {
        return message;
    }
}
