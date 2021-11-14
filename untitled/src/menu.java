import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.List;

@WebServlet(name = "menu")
public class menu extends HttpServlet {
    DBconnection jdbc=new DBconnection();
    JSONObject jsonObject=new JSONObject();
    JSONArray jsonArray = new JSONArray();
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String opt=request.getParameter("opt");
        if (opt.equals("findnum"))
        {
            findnum(request,response);
            return ;
        }
        if (opt.equals("bookmenu"))
        {
            bookmenu(request,response);
            return ;
        }
    }

    private void bookmenu(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        jsonObject=new JSONObject();
        jsonArray = new JSONArray();
        Calendar now = Calendar.getInstance();
        String menutext=request.getParameter("menutext");
        String menunum=request.getParameter("menunum");
        String typetext=request.getParameter("typetext");
        String username=request.getParameter("username");
        String usertime=username+now.get(Calendar.YEAR)+(now.get(Calendar.MONTH) + 1)+now.get(Calendar.DAY_OF_MONTH);
        if (typetext.length()==0||menunum.length()==0||menutext.length()==0||username.length()==0||Integer.parseInt(menunum)<=0)
        {
            jsonObject.put("msg","操作错误");
            response.getWriter().write(jsonObject.toString());
            return;
        }
        try {
            if (jdbc.Insert_and_Update("insert into BOOK_MENU values (?,?,?,?,?)",usertime,username,menutext,menunum,typetext))
            {
                jsonObject.put("num","1");
            }else
            {
                jsonObject.put("msg","操作错误");
            }
            response.getWriter().write(jsonObject.toString());
        } catch (IOException | SQLException throwables) {
            jsonObject.put("msg","服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }
    }

    private void findnum(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String id=request.getParameter("id");//搜索id
        jsonObject=new JSONObject();
        jsonArray = new JSONArray();
        try {
            List<MenuObject> list = jdbc.Query_Menu("select *from MENU where MENUID = ?",id);
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
        doPost(request,response);
    }
}
