import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@WebServlet(name = "admin")
public class admin extends HttpServlet {
    DBconnection jdbc = new DBconnection();
    JSONObject jsonObject = new JSONObject();
    JSONArray jsonArray = new JSONArray();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String opt = request.getParameter("opt");
        if (opt.equals("menushow")) {
            menushow(request, response);
            return;
        }
        if (opt.equals("menuupdate")) {
            menuupdate(request, response);
            return;
        }
        if (opt.equals("restaurant")) {
            restaurantdata(request, response);
            return;
        }
        if (opt.equals("changedesk")) {
            changedesk(request, response);
            return;
        }
        if (opt.equals("deskdata")) {
            deskdata(request, response);
            return;
        }
        if (opt.equals("cancel_desk_num")) {
            cancel_desk_num(request, response);
            return;
        }
        if (opt.equals("cancel_desk")) {
            cancel_desk(request, response);
            return;
        }
        if (opt.equals("change")) {
            change(request, response);
            return;
        }
        if (opt.equals("menudata")) {
            menudata(request, response);
            return;
        }
        if (opt.equals("cancel_menu")) {
            cancel_menu(request, response);
            return;
        }
        if (opt.equals("menu_detail")) {
            menu_detail(request, response);
            return;
        }
        if (opt.equals("comment")) {
            comment(request, response);
            return;
        }
        if (opt.equals("delete")) {
            delete(request, response);
            return;
        }
        if (opt.equals("usertext")) {
            information(request, response);
            return;
        }
        if (opt.equals("deleteuser")) {
            deleteuser(request, response);
            return;
        }
        if (opt.equals("changeuser")) {
            changeuser(request, response);
            return;
        }
        if (opt.equals("indexinfo")) {
            indexinfo(request, response);
            return;
        }
        if (opt.equals("menudelete")) {
            menudelete(request, response);
            return;
        }

    }

    private void menudelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String id = request.getParameter("id");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            List<MenuObject> list = jdbc.Query_Menu("select *from MENU where MENUID=?",id);
            if (list.size()<=0)
            {
                jsonObject.put("msg", "操作错误");
                response.getWriter().write(jsonObject.toString());
                return ;
            }
            if(jdbc.Insert_and_Update("delete from MENU where ( MENUID = ? )",id))
            {

                String picture=list.get(0).getPicture();
                deletefun(picture.trim());
                jsonObject.put("num", "1");
            }else
            {
                jsonObject.put("msg", "服务器错误");
            }
            response.getWriter().write(jsonObject.toString());
        } catch (SQLException | IOException throwables) {
            jsonObject.put("msg", "服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }
    }

    private void deletefun(String picture) {
        picture=picture.substring(picture.lastIndexOf("/")+1,picture.length());
        File file = new File("E:\\javaEE\\untitled\\web\\img",picture);
        if(file.exists()) {
            file.delete();
        }
        file = new File("E:\\Android\\MyApp\\app\\src\\main\\res\\drawable",picture);
        if(file.exists()) {
            file.delete();
        }
    }

    private void indexinfo(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        jsonObject = new JSONObject();
        try {
            jsonObject  = jdbc.Query_Index();
            if (jsonObject.size()<=0)
            {
                jsonObject.put("msg","服务器错误");
                response.getWriter().write(jsonObject.toString());
                return ;
            }
            response.getWriter().write(jsonObject.toString());
        } catch (IOException | SQLException throwables) {
            jsonObject.put("msg","服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }
    }

    private void changeuser(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String id=request.getParameter("id");
        String password=request.getParameter("password");
        String name=request.getParameter("name");
        String phone=request.getParameter("phone");
        String address=request.getParameter("address");
        String man=request.getParameter("man");
        if (password.length()<=0||name.length()<=0||phone.length()<=0||address.length()<=0||man.length()<=0)
        {
            jsonObject.put("msg", "输入为空");
            response.getWriter().write(jsonObject.toString());
            return;
        }
        try{
            if (jdbc.Insert_and_Update("update INFORMATION set PASSWORD=?,NAME=?,PHONE=?,ADDRESS=?,MANAGEMENT=? where ID=?",password,name,phone,address,man,id))
            {
                jsonObject.put("num", "1");
            }else
            {
                jsonObject.put("msg", "服务器错误");
            }
            response.getWriter().write(jsonObject.toString());
        } catch (SQLException | IOException throwables) {
            jsonObject.put("msg","服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }
    }

    private void deleteuser(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String id = request.getParameter("id");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            if(jdbc.Insert_and_Update("delete from INFORMATION where ( ID = ? )",id))
            {
                jsonObject.put("num", "1");
            }else
            {
                jsonObject.put("msg", "服务器错误");
            }
            response.getWriter().write(jsonObject.toString());
        } catch (SQLException | IOException throwables) {
            jsonObject.put("msg", "服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }
    }

    private void information(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        jsonObject=new JSONObject();
        jsonArray = new JSONArray();
        try {
            List<User> list = jdbc.Query_User("select *from INFORMATION ");
            for (int i=0;i<list.size();i++)
            {
                JSONObject json = (JSONObject) JSONObject.toJSON(list.get(i));
                jsonArray.add(json);
            }
            response.getWriter().write(jsonArray.toString());
        } catch (SQLException | IOException throwables) {
            jsonObject.put("msg","服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }
    }
    private void delete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String id = request.getParameter("id");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            if(jdbc.Insert_and_Update("delete from COMMENT where ( USERID = ? )",id))
            {
                jsonObject.put("num", "1");
            }else
            {
                jsonObject.put("msg", "服务器错误");
            }
            response.getWriter().write(jsonObject.toString());
        } catch (SQLException | IOException throwables) {
            jsonObject.put("msg", "服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }
    }
    private void comment(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        jsonObject=new JSONObject();
        jsonArray = new JSONArray();
        try {
            List<CommentObject> list = jdbc.Query_Comment("select *from COMMENT");
            for (int i=0;i<list.size();i++)
            {
                JSONObject json = (JSONObject) JSONObject.toJSON(list.get(i));
                jsonArray.add(json);
            }
            response.getWriter().write(jsonArray.toString());
        } catch (SQLException throwables) {
            jsonObject.put("msg","服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }
    }
    private void menu_detail(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String optnum = request.getParameter("optnum");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            List<BookObject> list = jdbc.Query_Book("select *from BOOK_MENU where ID = ?",optnum);
            for (int i = 0; i < list.size(); i++) {
                JSONObject json = (JSONObject) JSONObject.toJSON(list.get(i));
                jsonArray.add(json);
            }
            response.getWriter().write(jsonArray.toString());
        } catch (SQLException | IOException throwables) {
            jsonObject.put("msg", "服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }
    }

    private void cancel_menu(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String id = request.getParameter("id");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            if(jdbc.Insert_and_Update("update BOOK_MENU set TYPE='(%E5%8F%96%E6%B6%88%E8%AE%A2%E5%8D%95)'+TYPE where ID=? ",id))
            {
                jsonObject.put("num", "1");
            }else
            {
                jsonObject.put("msg", "服务器错误");
            }
            response.getWriter().write(jsonObject.toString());
        } catch (SQLException | IOException throwables) {
            jsonObject.put("msg", "服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }
    }

    private void menudata(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            List<BookObject> list = jdbc.Query_Book("select *from BOOK_MENU ORDER BY LEN(TYPE) ASC,ID");
            for (int i = 0; i < list.size(); i++) {
                JSONObject json = (JSONObject) JSONObject.toJSON(list.get(i));
                jsonArray.add(json);
            }
            response.getWriter().write(jsonArray.toString());
        } catch (SQLException | IOException throwables) {
            jsonObject.put("msg", "服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }

    }

    private void cancel_desk(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String id = request.getParameter("id");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            if (jdbc.Insert_and_Update("update BOOK_DESK set type='(%E5%AE%8C%E6%88%90%E8%AE%A2%E6%A1%8C)'+type where ID=?", id)) {
                List<BookDesk> list = jdbc.Query_BookDesk("select  *from BOOK_DESK where ID=?", id);
                for (int i = 0; i < list.size(); i++) {
                    JSONObject json = (JSONObject) JSONObject.toJSON(list.get(i));
                    jsonArray.add(json);
                }
                response.getWriter().write(jsonArray.toString());
                return;
            } else {
                jsonObject.put("msg", "服务器错误");
            }
            response.getWriter().write(jsonObject.toString());
        } catch (SQLException | IOException throwables) {
            jsonObject.put("msg", "服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }
    }

    private void cancel_desk_num(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String type = request.getParameter("type");
        String time = request.getParameter("time");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            if (jdbc.Insert_and_Update("update RESTAURANT set " + time + "=" + time + "+1 where NAME=?", type)) {
                jsonObject.put("cal", "1");
            } else {
                jsonObject.put("msg", "服务器错误");
            }
            response.getWriter().write(jsonObject.toString());
        } catch (SQLException | IOException throwables) {
            jsonObject.put("msg", "服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }
    }

    private void deskdata(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            List<BookDesk> list = jdbc.Query_BookDesk("select *from BOOK_DESK ORDER BY LEN(TYPE) ASC,ID");
            for (int i = 0; i < list.size(); i++) {
                JSONObject json = (JSONObject) JSONObject.toJSON(list.get(i));
                jsonArray.add(json);
            }
            response.getWriter().write(jsonArray.toString());
        } catch (SQLException | IOException throwables) {
            jsonObject.put("msg", "服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }
    }

    private void changedesk(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        String species = request.getParameter("species");
        String desk = request.getParameter("desk");
        String time = request.getParameter("time");
        String num = request.getParameter("num");
        try {
            if (jdbc.Insert_and_Update("update RESTAURANT set " + time + "=" + time + "+? where NAME=?", num, desk)) {
                jsonObject.put("num", "1");
            } else {
                jsonObject.put("msg", "操作错误");
            }
            response.getWriter().write(jsonObject.toString());
        } catch (SQLException | IOException throwables) {
            jsonObject.put("msg", "服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }


    }

    private void restaurantdata(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            List<Desk> list = jdbc.Query_Desk();
            for (int i = 0; i < list.size(); i++) {
                JSONObject json = (JSONObject) JSONObject.toJSON(list.get(i));
                jsonArray.add(json);
            }
            response.getWriter().write(jsonArray.toString());
        } catch (SQLException | IOException throwables) {
            jsonObject.put("msg", "服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }
    }

    private void change(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String type = request.getParameter("type");
        String time = request.getParameter("time");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            if (jdbc.Insert_and_Update("update RESTAURANT set " + time + "=" + time + "+1 where NAME=?", type)) {
                jsonObject.put("cal", "1");
            } else {
                jsonObject.put("msg", "服务器错误");
            }
            response.getWriter().write(jsonObject.toString());
        } catch (SQLException | IOException throwables) {
            jsonObject.put("msg", "服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }
    }

    private void menuupdate(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        String species = request.getParameter("species");
        String name = request.getParameter("name");
        String price = request.getParameter("price");
        String menuid = request.getParameter("menuid");
        if (species.length() <= 0 || name.length() <= 0 || price.length() <= 0 || menuid.length() <= 0) {
            jsonObject.put("msg", "输入为空");
            response.getWriter().write(jsonObject.toString());
            return;
        }
        try {
            if (jdbc.Insert_and_Update("update MENU set SPECIES=?,NAME=?,PRICE=? where ( MENUID=?)", species, name, price, menuid)) {
                jsonObject.put("num", "1");
            } else {
                jsonObject.put("msg", "服务器错误");
            }
            response.getWriter().write(jsonObject.toString());
        } catch (SQLException | IOException throwables) {
            jsonObject.put("msg", "服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }
    }

    private void menushow(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            List<MenuObject> list = jdbc.Query_Menu("select *from MENU");
            for (int i = 0; i < list.size(); i++) {
                JSONObject json = (JSONObject) JSONObject.toJSON(list.get(i));
                jsonArray.add(json);
            }
            response.getWriter().write(jsonArray.toString());
        } catch (SQLException | IOException throwables) {
            jsonObject.put("msg", "服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
