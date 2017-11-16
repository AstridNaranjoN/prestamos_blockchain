package com.prestamosblockchain.transaction.rest;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;
public class RestfulClient<T> {
	private final static String URL="http://179.50.12.58:3000/";
	//private final static String URL="http://201.232.60.131:3100/";
	private RestTemplate restTemplate;

    public RestfulClient(){
    		this.restTemplate = new RestTemplate();
    }

    public <W> ResponseEntity<W> postEntity(String path, T t,Class<W> clazz){
    		String postUrl=RestfulClient.URL+path;
        ResponseEntity<W> postResponse = this.restTemplate.postForEntity(postUrl, t, clazz);
        return postResponse;
    }

    public ResponseEntity<T> getEntity(String path, Class<T> clazz){
        String getUrl=RestfulClient.URL+path;
        ResponseEntity<T> getResponse = this.restTemplate.getForEntity(getUrl, clazz);
        return getResponse;
    }

    public <W> W putEntity(String path, T t,Class<W> clazz){
        String putUrl = RestfulClient.URL+path;

        this.restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());
        HttpEntity<T> requestEntity = new HttpEntity<T>(t);

        HttpEntity<W> response = restTemplate.exchange(putUrl, HttpMethod.PUT, requestEntity, clazz);

        return response.getBody();
    }


    /*public void deleteEntity(){
        System.out.println("Begin /DELETE request!");
        String deleteUl = "http://localhost:8080/delete/1";
        restTemplate.delete(deleteUl);
    }*/
}
