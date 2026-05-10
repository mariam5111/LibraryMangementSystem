package com.LMS.gateway;

import org.springframework.boot.context.properties.ConfigurationProperties;

/*
  Configuration properties holder for gateway URIs.
  Bound from properties prefixed with "gateway" (fi application.properties or YAML).
 */
@ConfigurationProperties(prefix = "gateway")
public class GatewayUriConfiguration {
    private String libraryServiceUri = "http://localhost:8082";
    private String authServiceUri = "http://localhost:8081";

    public String getLibraryServiceUri() {
        return libraryServiceUri;
    }

    public void setLibraryServiceUri(String libraryServiceUri) {
        this.libraryServiceUri = libraryServiceUri;
    }

    public String getAuthServiceUri() {
        return authServiceUri;
    }

    public void setAuthServiceUri(String authServiceUri) {
        this.authServiceUri = authServiceUri;
    }

    
}
