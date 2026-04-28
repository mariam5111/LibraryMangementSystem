# --- Stage 1: Build Stage ---
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# 1. Copy only the pom.xml to download dependencies (improves cache speed)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 2. Copy the source code and build the JAR
COPY src ./src
RUN mvn clean package -DskipTests

# --- Stage 2: Run Stage ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# 3. Copy only the built JAR from the first stage
# Note: Ensure the filename 'gateway-0.0.1-SNAPSHOT.jar' matches your pom.xml artifactId/version
COPY --from=build /app/target/*.jar gateway.jar

EXPOSE 8080

# 4. Use the smaller JRE image to run the app
ENTRYPOINT ["java", "-jar", "gateway.jar"]