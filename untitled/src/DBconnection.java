import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.sql.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Date;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class DBconnection {
    ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(100, 100, 1000L, TimeUnit.MILLISECONDS, new ArrayBlockingQueue<Runnable>(10), Executors.defaultThreadFactory(), new ThreadPoolExecutor.CallerRunsPolicy());
    private static LinkedList<Connection> dataSources = new LinkedList<Connection>();
    private static String ip = "127.0.0.1:1433";
    private static String database = "myweb";
    private static String user = "cfydzl";
    private static String password = "123506467";

    public DBconnection() {
        if (dataSources.size() == 0) {
            init();
        }
    }

    //    创建链接
    public void init() {
        for (int i = 0; i < 100; i++) {
            threadPoolExecutor.execute(() -> {
                try {
                    Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");//加载驱动
                    Connection con = DriverManager.getConnection("jdbc:sqlserver://" + ip + ";DatabaseName=" + database + "", user, password);
                    dataSources.add(con);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }
        if (threadPoolExecutor != null) {
            threadPoolExecutor.shutdown();
        }
    }

    //    获取时间
    public String get_time() {
        String result = "";
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        int year = cal.get(Calendar.YEAR);
        result = result + String.valueOf(year);
        int month = cal.get(Calendar.MONTH) + 1;
        if (month < 10) {
            result = result + "0";
        }
        result = result + String.valueOf(month);
        int date = cal.get(Calendar.DATE);
        if (date < 10) {
            result = result + "0";
        }
        result = result + String.valueOf(date);
        return result;
    }

    //    获取链接
    public Connection getConnection() throws SQLException {
        if (dataSources.size() == 0) {
            init();
        }
        return dataSources.removeFirst();
    }

    //  释放链接
    public void releaseConnection(Connection conn) {
        dataSources.add(conn);
        return;
    }

    //    数据库查询是否存在
    public boolean Query(String sql, Object... objectses) throws SQLException {
        boolean result = false;
        Connection con = null;
        con = getConnection();
        PreparedStatement preparedStatement = con.prepareStatement(sql);
        for (int i = 0; i < objectses.length; i++) {
            preparedStatement.setObject(i + 1, objectses[i].toString().trim());
        }
        ResultSet resultSet = preparedStatement.executeQuery();
        if (resultSet.next()) {
            result = true;
        }
        releaseConnection(con);
        return result;
    }

    //    插入和更新
    public boolean Insert_and_Update(String sql, Object... objectses) throws SQLException {
        boolean result = false;
        Connection con = null;
        con = getConnection();
        PreparedStatement preparedStatement = con.prepareStatement(sql);//执行SQL语句
        for (int i = 0; i < objectses.length; i++) {
            preparedStatement.setObject(i + 1, objectses[i].toString().trim());
        }
        if (preparedStatement.executeUpdate() > 0) {
            result = true;
        } else {
            result = false;
        }
        releaseConnection(con);//释放连接
        return result;
    }

    //    数据库查询
    public List Query_AppUser(String sql, Object... objectses) throws SQLException {
        List<AppUser> list = new ArrayList<AppUser>();
        Connection con = null;
        con = getConnection();
        PreparedStatement preparedStatement = con.prepareStatement(sql);
        for (int i = 0; i < objectses.length; i++) {
            preparedStatement.setObject(i + 1, objectses[i].toString().trim());
        }
        ResultSet resultSet = preparedStatement.executeQuery();
        for (int i = 0; resultSet.next(); i++) {
            AppUser people = new AppUser(resultSet.getString(2).trim(),
                    resultSet.getString(3).trim(),
                    resultSet.getString(4).trim(),
                    resultSet.getString(5).trim(),
                    resultSet.getString(6).trim()
            );
            list.add(i, people);
        }
        releaseConnection(con);
        return list;
    }

    //    数据库查询菜单
    public List Query_Menu(String sql, Object... objectses) throws SQLException {
        List<MenuObject> list = new ArrayList<MenuObject>();
        Connection con = null;
        con = getConnection();
        PreparedStatement preparedStatement = con.prepareStatement(sql);
        for (int i = 0; i < objectses.length; i++) {
            preparedStatement.setObject(i + 1, objectses[i].toString().trim());
        }
        ResultSet resultSet = preparedStatement.executeQuery();
        for (int i = 0; resultSet.next(); i++) {
            MenuObject menu = new MenuObject(resultSet.getString(1).trim(),
                    resultSet.getString(2).trim(),
                    resultSet.getString(3).trim(),
                    resultSet.getString(4).trim(),
                    resultSet.getString(5).trim()
            );
            list.add(i, menu);
        }
        releaseConnection(con);
        return list;
    }

    //    查询订单
    public List Query_Book(String sql,Object... objectses) throws SQLException {
        List<BookObject> list = new ArrayList<BookObject>();
        Connection con = null;

        con = getConnection();
        PreparedStatement preparedStatement = con.prepareStatement(sql);
        for (int i = 0; i < objectses.length; i++) {
            preparedStatement.setObject(i + 1, objectses[i].toString().trim());
        }
        ResultSet resultSet = preparedStatement.executeQuery();
        for (int i = 0; resultSet.next(); i++) {
            BookObject book = new BookObject(resultSet.getString(1).trim(),
                    resultSet.getString(2).trim(),
                    resultSet.getString(3).trim(),
                    resultSet.getString(4).trim(),
                    resultSet.getString(5).trim(),
                    resultSet.getString(6).trim()
            );
            list.add(i, book);
        }
        releaseConnection(con);
        return list;
    }
//    用户信息
    public List Query_User(String sql,Object... objectses) throws SQLException {
        List<User> list = new ArrayList<User>();
        Connection con = null;
        con = getConnection();
        PreparedStatement preparedStatement = con.prepareStatement(sql);
        for (int i = 0; i < objectses.length; i++) {
            preparedStatement.setObject(i + 1, objectses[i].toString().trim());
        }
        ResultSet resultSet = preparedStatement.executeQuery();
        for (int i = 0; resultSet.next(); i++) {
                User user = new User(
                        resultSet.getString(1).trim(),
                        resultSet.getString(2).trim(),
                        resultSet.getString(3).trim(),
                        resultSet.getString(4).trim(),
                        resultSet.getString(5).trim(),
                        resultSet.getString(6).trim(),
                        resultSet.getString(7).trim()
            );
            list.add(i, user);
        }
        releaseConnection(con);
        return list;
    }
    //    查询评论
    public List Query_Comment(String sql,Object... objectses) throws SQLException {
        List<CommentObject> list = new ArrayList<CommentObject>();
        Connection con = null;
        con = getConnection();
        PreparedStatement preparedStatement = con.prepareStatement(sql);
        for (int i = 0; i < objectses.length; i++) {
            preparedStatement.setObject(i + 1, objectses[i].toString().trim());
        }
        ResultSet resultSet = preparedStatement.executeQuery();
        for (int i = 0; resultSet.next(); i++) {
            CommentObject comment = new CommentObject(resultSet.getString(1).trim(),
                    resultSet.getString(2).trim(),
                    resultSet.getString(3).trim(),
                    resultSet.getString(4).trim(),
                    resultSet.getString(5).trim()
            );
            list.add(i, comment);
        }
        releaseConnection(con);
        return list;
    }

    //    数据库查询桌子
    public List Query_Desk() throws SQLException {
        String sql = "select *from RESTAURANT";
        List<Desk> list = new ArrayList<Desk>();
        Connection con = null;
        con = getConnection();
        PreparedStatement preparedStatement = con.prepareStatement(sql);
        ResultSet resultSet = preparedStatement.executeQuery();
        for (int i = 0; resultSet.next(); i++) {
            Desk desk = new Desk(resultSet.getString(2).trim(),
                    resultSet.getString(3).trim(),
                    resultSet.getString(4).trim(),
                    resultSet.getString(5).trim(),
                    resultSet.getString(6).trim(),
                    resultSet.getString(7).trim()
            );
            list.add(i, desk);
        }
        releaseConnection(con);
        return list;
    }

    //    查询订桌
    public List Query_BookDesk(String sql, Object ...objectses) throws SQLException {
        List<BookDesk> list = new ArrayList<BookDesk>();
        Connection con = null;
        con = getConnection();
        PreparedStatement preparedStatement = con.prepareStatement(sql);
        for (int i = 0; i < objectses.length; i++) {
            preparedStatement.setObject(i + 1, objectses[i].toString().trim());
        }
        ResultSet resultSet = preparedStatement.executeQuery();
        for (int i = 0; resultSet.next(); i++) {
            BookDesk bookdesk = new BookDesk(resultSet.getString(1).trim(),
                    resultSet.getString(2).trim(),
                    resultSet.getString(3).trim(),
                    resultSet.getString(4).trim(),
                    resultSet.getString(5).trim()
            );
            list.add(i, bookdesk);
        }
        releaseConnection(con);
        return list;
    }
    //    取消订桌
    public List Cancel_Desk(String sql, Object ...objectses) throws SQLException {
        List<String> list = new ArrayList<String>();
        Connection con = null;
        con = getConnection();
        PreparedStatement preparedStatement = con.prepareStatement(sql);
        for (int i = 0; i < objectses.length; i++) {
            preparedStatement.setObject(i + 1, objectses[i].toString().trim());
        }
        ResultSet resultSet = preparedStatement.executeQuery();
        for (int i = 0; resultSet.next(); i++) {
            list.add(i,resultSet.getString(4).trim());
            list.add(i+1,resultSet.getString(5).trim());
        }
        releaseConnection(con);
        return list;
    }
    public static void main(String args[]) throws ClassNotFoundException, SQLException {
        Date today = new Date();
        SimpleDateFormat sf = new SimpleDateFormat("yyyyMMddHHmmss");
        String time = sf.format(today);
        System.out.println(time);
    }

    public JSONObject Query_Index() throws SQLException {
        Date date=new Date();
        DateFormat format=new SimpleDateFormat("yyyyMMdd");
        JSONObject jsonObject=new JSONObject();
        Connection con = null;
        con = getConnection();


        String sql = "select count(*)num from BOOK_MENU where MENU_ID like '%"+format.format(date)+"'";
        PreparedStatement preparedStatement = con.prepareStatement(sql);
        ResultSet resultSet = preparedStatement.executeQuery();
        resultSet.next();
        jsonObject.put("today-menu",resultSet.getString(1));


        sql = "select count(*)num from BOOK_MENU where TYPE like '(%E5%AE%8C%E6%88%90%E8%AE%A2%E5%8D%95)%'";
        preparedStatement = con.prepareStatement(sql);
        resultSet = preparedStatement.executeQuery();
        resultSet.next();
        jsonObject.put("win-menu",resultSet.getString(1).trim());

        sql = "select count(*)num from BOOK_MENU";
        preparedStatement = con.prepareStatement(sql);
        resultSet = preparedStatement.executeQuery();
        resultSet.next();
        jsonObject.put("sum-menu",resultSet.getString(1).trim());

        sql = "select count(*)num from BOOK_DESK where BOOK_ID like '%"+format.format(date)+"'";
        preparedStatement = con.prepareStatement(sql);
        resultSet = preparedStatement.executeQuery();
        resultSet.next();
        jsonObject.put("today-book",resultSet.getString(1).trim());

        sql = "select count(*)num from BOOK_DESK where TYPE like '(%E5%AE%8C%E6%88%90%E8%AE%A2%E6%A1%8C)%'";
        preparedStatement = con.prepareStatement(sql);
        resultSet = preparedStatement.executeQuery();
        resultSet.next();
        jsonObject.put("win-book",resultSet.getString(1).trim());

        sql = "select count(*)num from BOOK_DESK";
        preparedStatement = con.prepareStatement(sql);
        resultSet = preparedStatement.executeQuery();
        resultSet.next();
        jsonObject.put("sum-book",resultSet.getString(1).trim());

        sql = "select count(*)num from INFORMATION";
        preparedStatement = con.prepareStatement(sql);
        resultSet = preparedStatement.executeQuery();
        resultSet.next();
        jsonObject.put("sum-user",resultSet.getString(1).trim());

        sql = "select count(*)num from COMMENT";
        preparedStatement = con.prepareStatement(sql);
        resultSet = preparedStatement.executeQuery();
        resultSet.next();
        jsonObject.put("sum-comment",resultSet.getString(1).trim());

        releaseConnection(con);
        return jsonObject;
    }
}