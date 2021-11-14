public class User {
    private String id,username,password,name,phone,address,management;
    public User(String id,String username,String password,String name,String phone,String address,String management)
    {
        this.id=id;
        this.username=username;
        this.password=password;
        this.name=name;
        this.phone=phone;
        this.address=address;
        this.management=management;
    }

    public String getUsername() {
        return username;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPassword() {
        return password;
    }

    public String getAddress() {
        return address;
    }

    public String getPhone() {
        return phone;
    }
}
