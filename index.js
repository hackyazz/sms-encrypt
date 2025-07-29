let result = null;
let textarea_input = null;
const REQUEST_URL = "https://k8sms.com/api/v1";
// 192.168.31.253:8093
window.onload = function () {
  let encrypt_button = document.getElementById("transfer");
  console.log(encrypt_button);
  encrypt_button.onclick = encrypt_button_click;
  let delete_button = document.getElementById("delete");
  console.log(delete_button);
  delete_button.onclick = delete_button_click;
  let check_button = document.getElementById("check");
  console.log(check_button);
  check_button.onclick = check_button_click;

  result = document.getElementById("result");
  textarea_input = document.getElementById("input");
};

function get_textarea_text() {}

function encrypt_button_click(e) {
  console.log("encrypt_button_click ", e);
  console.log(textarea_input.value);
  const formData = new FormData();
  formData.append("content", textarea_input.value);
  result.innerText = "正在加密，请等待...";
  request({
    method: "POST",
    url: `${REQUEST_URL}/url_encipher/batch_encipher`,
    data: formData,
  })
    .then((res) => {
      console.log(res);
      result.innerText = res;
    })
    .catch((err) => {
      console.warn(err);
    });

  // const formData = new FormData();
  // formData.append('username', 'yazz');
  // formData.append('file', fileInput.files[0]);
}

function delete_button_click(e) {
  console.log("delete_button_click ", e);
  

  const isConfirm = window.confirm("是否确认删除");

  if (isConfirm) {
    result.innerText = "正在删除，请等待...";
    const formData = new FormData();
    formData.append("content", textarea_input.value);

    request({
      method: "POST",
      url: `${REQUEST_URL}/url_encipher/batch_delete_encipher`,
      data: formData,
    })
      .then((res) => {
        console.log(res);
        result.innerText = res;
      })
      .catch((err) => {
        console.warn(err);
      });
  }
}

function check_button_click(e) {
  console.log("check_button_click ", e);
  result.innerText = "正在查询，请等待...";

  const formData = new FormData();
  formData.append("content", textarea_input.value);

  request({
    method: "POST",
    url: `${REQUEST_URL}/url_encipher/batch_query_encipher`,
    data: formData,
  })
    .then((res) => {
      console.log(res);
      result.innerText = res;
    })
    .catch((err) => {
      console.warn(err);
    });
}

function request({
  method = "GET",
  url,
  data = null,
  headers = {},
  timeout = 10000,
}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url, true);
    xhr.timeout = timeout;

    // 判断是否是 FormData
    const isFormData = data instanceof FormData;

    // 设置 headers（除非是 FormData，Content-Type 不需要手动设置）
    for (const key in headers) {
      if (isFormData && key.toLowerCase() === "content-type") continue;
      xhr.setRequestHeader(key, headers[key]);
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`请求失败：${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error("网络错误"));
    xhr.ontimeout = () => reject(new Error("请求超时"));

    // 发送请求
    if (method.toUpperCase() === "POST") {
      if (isFormData) {
        xhr.send(data);
      } else {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
      }
    } else {
      xhr.send();
    }
  });
}
