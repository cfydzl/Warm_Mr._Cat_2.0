import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

import com.alibaba.fastjson.JSONObject;

@WebServlet(name = "Servlet")
public class user_information extends HttpServlet {
    public static final String STR_ENG_PATTERN="^[a-z0-9A-Z]+$";
    DBconnection jdbc=new DBconnection();
    JSONObject jsonObject=new JSONObject();
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request,response);
    }
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String opt=request.getParameter("opt");
        if (opt.equals("state"))
        {
            find_user(request,response);
            return;
        }
        if (opt.equals("init"))
        {
            init(request,response);
            return;
        }
        if(opt.equals("login"))
        {
            user_login(request,response);
            return;
        }
    }
//    注册
    private void user_login(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        jsonObject=new JSONObject();
        String username=request.getParameter("username");
        String password=request.getParameter("password");
        String repassword=request.getParameter("repassword");
        if (username.length()==0||password.length()==0||repassword.length()==0)
        {
            jsonObject.put("msg","输入为空");
        }else if (!password.equals(repassword))
        {
            jsonObject.put("msg","密码不同");
        }else if(username.length()<8||password.length()<8)
        {
            jsonObject.put("msg","长度>=8");
        }else if(!username.matches(STR_ENG_PATTERN)||!password.matches(STR_ENG_PATTERN))
        {
            jsonObject.put("msg","输入非法");
        }else{
            try {
                if(jdbc.Query("select *from INFORMATION where USERNAME = ? and MANAGEMENT = ?",username,0))
                {
                    jsonObject.put("msg","账户存在");
                }else
                {
                    if (jdbc.Insert_and_Update("insert into INFORMATION values (?,?,'','','',0)",username,password))
                    {
                        jsonObject.put("num","1");
                    }else
                    {
                        jsonObject.put("msg","注册失败");
                    }
                }
            } catch (SQLException throwables) {
                jsonObject.put("msg","服务器错误");
                throwables.printStackTrace();
            }
        }
        response.getWriter().write(jsonObject.toString());
    }

    //    连接池初始化
    private void init(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        jsonObject=new JSONObject();
        try {
            jdbc=new DBconnection();
        } catch (Exception e) {
            e.printStackTrace();
            jsonObject=new JSONObject();
            jsonObject.put("msg","服务器错误");
        }
        response.getWriter().write(jsonObject.toString());
    }
//    登录
    private void find_user(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        response.setContentType("text/html; charset=utf-8");
        jsonObject=new JSONObject();
        String username=request.getParameter("username");
        String password=request.getParameter("password");
        if(username.length()==0||password.length()==0)
        {
            jsonObject.put("msg","输入为空");
        }else
        {
            try {
                if (jdbc.Query("select *from INFORMATION where USERNAME = ? and PASSWORD = ? and MANAGEMENT = 0",username,password))
                {
                    jsonObject.put("num","1");
                }else if (jdbc.Query("select *from INFORMATION where USERNAME = ? and PASSWORD = ? and MANAGEMENT = 1",username,password))
                {
                    jsonObject.put("num","2");
                }else
                {
                    jsonObject.put("msg","密码错误");
                }
            } catch (SQLException throwables) {
                jsonObject.put("msg","服务器错误");
                throwables.printStackTrace();
            }
        }
        response.getWriter().write(jsonObject.toString());
    }
}
