import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@WebServlet(name = "order")
public class order extends HttpServlet {
    DBconnection jdbc = new DBconnection();
    JSONObject jsonObject = new JSONObject();
    JSONArray jsonArray = new JSONArray();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String opt = request.getParameter("opt");
        if (opt.equals("findrestaurant")) {
            findrestaurant(request, response);
            return;
        }
        if (opt.equals("finddesk")) {
            finddesk(request, response);
            return;
        }
        if (opt.equals("canceldesk")) {
            canceldesk(request, response);
            return;
        }
        if (opt.equals("change")) {
            change(request, response);
            return;
        }
        if (opt.equals("cancel")) {
            cancel(request, response);
            return;
        }
        if (opt.equals("findtext")){
            findtext(request,response);
            return ;
        }
        if (opt.equals("findcomment")){
            findcomment(request,response);
            return ;
        }
        if (opt.equals("insert")){
            insert(request,response);
            return ;
        }
        if (opt.equals("delete")){
            delete(request,response);
            return ;
        }
    }

    private void delete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String optid = request.getParameter("optid");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            if(jdbc.Insert_and_Update("delete from COMMENT where ( USERID = ? )",optid))
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

    private void insert(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String opttext= request.getParameter("opttext");
        String username= request.getParameter("username");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        Date date=new Date();
        DateFormat format=new SimpleDateFormat("yyyy-MM-dd");
        try {
            if(jdbc.Insert_and_Update("insert into COMMENT values (?,?,?,0)",username,opttext,format.format(date)))
            {
                List<CommentObject> list = jdbc.Query_Comment("select top 1 * from COMMENT where NAME = ? order by USERID desc",username);
                for (int i = 0; i < list.size(); i++) {
                    JSONObject json = (JSONObject) JSONObject.toJSON(list.get(i));
                    jsonArray.add(json);
                }
                response.getWriter().write(jsonArray.toString());
                return ;
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

    private void findcomment(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String username = request.getParameter("username");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            List<CommentObject> list = jdbc.Query_Comment("select *from COMMENT where NAME = ? ORDER BY USERID DESC",username);
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

    private void findtext(HttpServletRequest request, HttpServletResponse response) throws IOException {
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

    private void cancel(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String cal = request.getParameter("cal");
        String username= request.getParameter("username");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            if(jdbc.Insert_and_Update("update BOOK_MENU set TYPE='(%E5%8F%96%E6%B6%88%E8%AE%A2%E5%8D%95)'+TYPE where ID=? and USERNAME=?",cal,username))
            {
                jsonObject.put("cal", "1");
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

    private void change(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String type = request.getParameter("type");
        String time= request.getParameter("time");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            if(jdbc.Insert_and_Update("update RESTAURANT set "+time+"="+time+"+1 where NAME=?",type))
            {
                jsonObject.put("cal", "1");
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

    private void canceldesk(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String username = request.getParameter("username");
        String id = request.getParameter("id");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            if(jdbc.Insert_and_Update("update BOOK_DESK set TYPE='(%E5%8F%96%E6%B6%88%E8%AE%A2%E6%A1%8C)'+TYPE where " +
                    "                (ID=? and USERNAME=?)",id,username))
            {
                List<String> list=jdbc.Cancel_Desk("select *from BOOK_DESK where ID=?",id);
                jsonObject.put("cal", "1");
                jsonObject.put("type", list.get(0));
                jsonObject.put("time", list.get(1));
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

    private void finddesk(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String username = request.getParameter("username");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            List<BookDesk> list = jdbc.Query_BookDesk("select *from BOOK_DESK where USERNAME=? ORDER BY LEN(TYPE) ASC,ID",username);
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

    private void findrestaurant(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        String username = request.getParameter("username");
        jsonObject = new JSONObject();
        jsonArray = new JSONArray();
        try {
            List<BookObject> list = jdbc.Query_Book("select *from BOOK_MENU where USERNAME = ? ORDER BY LEN(TYPE) ASC,ID",username);
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
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws
            ServletException, IOException {
        doPost(request, response);
    }
}
