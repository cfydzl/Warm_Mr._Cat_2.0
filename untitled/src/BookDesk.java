public class BookDesk {
    private String id,book_id,username,type,time;
    public BookDesk(String id,String book_id,String username,String type,String time)
    {
        this.id=id;
        this.book_id=book_id;
        this.username=username;
        this.type=type;
        this.time=time;
    }

    public String getType() {
        return type;
    }

    public String getId() {
        return id;
    }

    public String getTime() {
        return time;
    }

    public String getUsername() {
        return username;
    }

    public String getBook_id() {
        return book_id;
    }
}
