import axios from "axios";

class HTTPService {
  instance = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {'Content-Type': 'application/json'}
  });

  async get(url: string) {
    const { data } = await this.instance.get(url);
    return data;
  }

  async post(url: string, body: Record<string, unknown>) {
    await this.instance.post(url, body);
  }

}

const singletonHttpService = new HTTPService();

export { singletonHttpService };
