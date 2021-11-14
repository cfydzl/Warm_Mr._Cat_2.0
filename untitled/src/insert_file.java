import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FileUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@WebServlet(name = "insert_file")
public class insert_file extends HttpServlet {
    DBconnection jdbc = new DBconnection();
    String webRootPath="E:\\javaEE\\untitled\\web";
    String dirPath="\\img";
    JSONObject jsonObject = new JSONObject();
    JSONArray jsonArray = new JSONArray();
    String name="",species="",price="",picture="";


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html; charset=utf-8");
        jsonObject = new JSONObject();
        try {
            //解析三步
            //创建工厂
            FileItemFactory factory = new DiskFileItemFactory();
            //创建解析器对象
            ServletFileUpload sfu = new ServletFileUpload(factory);
            //解析request对象，得到用户请求对象中的所以数据，返回一个List<FileItem>
            List<FileItem> parseRequest = sfu.parseRequest(request);

            for (FileItem fileItem : parseRequest) {
                if(fileItem.isFormField()) {//表单数据，打印
                    String tName = fileItem.getFieldName();
                    if("name".equals(tName)){
                        name =fileItem.getString("UTF-8");
                    }else if("species".equals(tName)){
                        species =fileItem.getString("UTF-8");
                    }else if("picture".equals(tName)){
                        picture =fileItem.getString("UTF-8");
                    }else if("price".equals(tName)){
                        price =fileItem.getString("UTF-8");
                    }
                } else {//文件，保存在file目录下
                    //创建目录
                    String savePath=webRootPath+dirPath;
                    String originalFilename = fileItem.getName();
                    String type = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
                    String newFilename = picture+"."+type;
                    File file = new File(savePath);
                    if(!file.exists() && !file.isDirectory()) {
                        file.mkdirs();//不存在该目录则创建该目录
                    }
                    file = new File(savePath,newFilename);
                    if(file.exists()) {
                        jsonObject.put("msg","图片已存在");
                    }else
                    {
                        fileItem.write(file);
                        if(file.exists()) {
                            if(jdbc.Insert_and_Update("insert into MENU values (?,?,?,?)",species,name,price,"../img/"+newFilename))
                            {
                                jsonObject.put("msg","插入成功");
                                File filecopy = new File("E:\\Android\\MyApp\\app\\src\\main\\res\\drawable",newFilename);
                                FileUtils.copyFile(file, filecopy);
                            }else
                            {
                                file.delete();
                                jsonObject.put("msg","插入失败");
                            }
                        }
                    }

                }
            }
            response.getWriter().write(jsonObject.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request,response);
    }
}
