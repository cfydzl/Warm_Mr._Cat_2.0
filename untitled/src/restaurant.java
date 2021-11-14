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

@WebServlet(name = "restaurant")
public class restaurant extends HttpServlet {
    DBconnection jdbc=new DBconnection();
    JSONObject jsonObject=new JSONObject();
    JSONArray jsonArray = new JSONArray();
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String opt=request.getParameter("opt");
        if (opt.equals("findnum"))
        {
            find_num(request,response);
            return;
        }
        if (opt.equals("bookdesk"))
        {
            book_desk(request,response);
            return;
        }
    }

    private void book_desk(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Calendar now = Calendar.getInstance();
        response.setContentType("text/html; charset=utf-8");
        jsonObject=new JSONObject();
        String desk=request.getParameter("desk");
        String desktext=request.getParameter("desktext");
        String time=request.getParameter("time");
        String timetext=request.getParameter("timetext");
        String username=request.getParameter("username");
        String usertime=username+now.get(Calendar.YEAR)+(now.get(Calendar.MONTH) + 1)+now.get(Calendar.DAY_OF_MONTH);
        if (desk.length()==0||desktext.length()==0||time.length()==0||timetext.length()==0||username.length()==0)
        {
            jsonObject.put("msg","操作错误");
            response.getWriter().write(jsonObject.toString());
            return;
        }
        try {
            if (jdbc.Query("select *from RESTAURANT where NAME=? and "+time+">0",desk))
            {
                if(jdbc.Insert_and_Update("update RESTAURANT set "+time+"="+time+"-1 where NAME=?",desk))
                {
                    if(jdbc.Insert_and_Update("insert into BOOK_DESK values (?,?,?,?)",usertime,username,desktext,timetext))
                    {
                        jsonObject.put("num","1");
                    }else
                    {
                        jsonObject.put("msg","服务器错误");
                    }
                }else
                {
                    jsonObject.put("msg","服务器错误");
                }
            }else
            {
                jsonObject.put("msg","数量不足");
            }
            response.getWriter().write(jsonObject.toString());
        } catch (IOException | SQLException throwables) {
            jsonObject.put("msg","服务器错误");
            response.getWriter().write(jsonObject.toString());
            throwables.printStackTrace();
        }
    }

    private void find_num(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        jsonObject=new JSONObject();
        jsonArray = new JSONArray();
        try {
            List<Desk> list = jdbc.Query_Desk();
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
    public static void main(String args[]) throws ClassNotFoundException, SQLException {
        String time="<p><img src=\"../img/20210616150815.png\" alt=\"20210616150815.png\"></p><p>鬼知道怎么学的，反正一学就会了</p>";
        System.out.println(time.substring(time.indexOf("../img"),time.indexOf("alt")-2));
    }
}
