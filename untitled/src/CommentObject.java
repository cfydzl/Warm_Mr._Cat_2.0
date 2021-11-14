public class CommentObject {
    private String userid,name,text,time,ding;
    public  CommentObject(String userid,String name,String text,String time,String ding)
    {
        this.userid=userid;
        this.name=name;
        this.text=text;
        this.time=time;
        this.ding=ding;
    }

    public String getName() {
        return name;
    }

    public String getDing() {
        return ding;
    }

    public String getText() {
        return text;
    }

    public String getTime() {
        return time;
    }

    public String getUserid() {
        return userid;
    }
}
