import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@WebServlet(name = "center")
public class center extends HttpServlet {
    DBconnection jdbc=new DBconnection();
    JSONObject jsonObject=new JSONObject();
    JSONArray jsonArray = new JSONArray();
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String opt=request.getParameter("opt");
        if (opt.equals("information"))
        {
            information(request,response);
            return ;
        }
        if (opt.equals("changeinformation"))
        {
            changeinformation(request,response);
            return ;
        }
    }

    private void changeinformation(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String username=request.getParameter("username");
        String ifo=request.getParameter("setifo");
        String text=request.getParameter("text");
        if (text.length()<=0)
        {
            jsonObject.put("msg", "输入为空");
            response.getWriter().write(jsonObject.toString());
            return;
        }
        try{
            if (jdbc.Insert_and_Update("update INFORMATION set "+ifo+"=? where ( USERNAME=?)",text,username))
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

    private void information(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        jsonObject=new JSONObject();
        jsonArray = new JSONArray();
        String username=request.getParameter("username");
        try {
            List<User> list = jdbc.Query_User("select *from INFORMATION where USERNAME = ?",username);
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

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request,response);
    }
}
