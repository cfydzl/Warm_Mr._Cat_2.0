public class MenuObject {
    private String menuid,species,name,price,picture;
    public MenuObject(String Menuid,String Specise,String Name,String Price,String Picture)
    {
        this.menuid=Menuid;
        this.species=Specise;
        this.name=Name;
        this.price=Price;
        this.picture=Picture;
    }

    public String getSpecies() {
        return species;
    }

    public String getPrice() {
        return price;
    }

    public String getName() {
        return name;
    }

    public String getMenuid() {
        return menuid;
    }

    public String getPicture() {
        return picture;
    }
}
