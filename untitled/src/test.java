import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class test {
    static ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(100000, 100000, 1000L, TimeUnit.MILLISECONDS, new ArrayBlockingQueue<Runnable>(10), Executors.defaultThreadFactory(), new ThreadPoolExecutor.CallerRunsPolicy());
    private static LinkedList<Connection> dataSources = new LinkedList<Connection>();
    private static String ip = "127.0.0.1:1433";
    private static String database = "onecard";
    private static String user = "sa";
    private static String password = "123506467";
    private static int ii;


    public test()
    {

    }
    //    创建链接
    public static void init() {
        for (int i = 0; i < 20000; i++) {
            threadPoolExecutor.execute(() -> {
                try {
                    Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
                    Connection con = DriverManager.getConnection("jdbc:sqlserver://" + ip + ";DatabaseName=" + database + "", user, password);
                    dataSources.add(con);
                    Thread.sleep(100);
                    System.out.println(dataSources.size());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }
        if (threadPoolExecutor != null) {
            threadPoolExecutor.shutdown();
        }
        System.out.println("完成");
    }
    //    获取链接
    public static Connection getConnection() throws SQLException {
        if (dataSources.size() == 0) {
            init();
        }
        return dataSources.removeFirst();
    }

    //  释放链接
    public static void releaseConnection(Connection conn) {
        dataSources.add(conn);
        return;
    }
    public static void Insert_and_Update(String sql, Object... objectses) throws SQLException {
        boolean result = false;
        Connection con = null;
        con = getConnection();
        PreparedStatement preparedStatement = con.prepareStatement(sql);
        for (int i = 0; i < objectses.length; i++) {
            preparedStatement.setObject(i + 1, objectses[i].toString().trim());
        }
        if (preparedStatement.executeUpdate() > 0) {
            result = true;
        } else {
            result = false;
        }
        releaseConnection(con);
        return  ;
    }
    public static void main(String[] args) throws SQLException {
        String path="../img/java.png";
        System.out.println(path.substring(path.lastIndexOf("/")+1,path.length()));
    }
}
