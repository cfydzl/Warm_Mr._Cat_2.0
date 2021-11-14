import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@WebServlet(name = "index_show")
public class index_show extends HttpServlet {
    DBconnection jdbc=new DBconnection();
    JSONObject jsonObject=new JSONObject();
    JSONArray jsonArray = new JSONArray();
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String opt=request.getParameter("opt");
        if (opt.equals("commenttext"))
        {
            comment(request,response);
            return ;
        }
        if (opt.equals("menutext"))
        {
            menu(request,response);
            return ;
        }
    }

    private void menu(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String name=request.getParameter("name");
        jsonObject=new JSONObject();
        jsonArray = new JSONArray();
        try {
            List<MenuObject> list = jdbc.Query_Menu("select *from MENU where SPECIES = ?",name);
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

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
