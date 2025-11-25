import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocumentSection } from "@/components/docs/DocumentSection";
import { Printer, Download, Copy, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateMarkdownDoc, downloadMarkdown } from "@/lib/utils/markdown";

export default function JavaMigrationGuide() {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const sections = [
      {
        title: "Introducción",
        content: "Esta guía documenta la migración de las Edge Functions de Deno/TypeScript a un backend Java con Spring Boot.\n\nRequisitos previos:\n- Java 17 o superior\n- Maven 3.8+\n- PostgreSQL 14+\n- Docker (opcional)"
      },
      {
        title: "Estructura del Proyecto",
        content: "```\nsubscription-manager/\n├── src/main/java/com/subscriptions/\n│   ├── SubscriptionManagerApplication.java\n│   ├── config/\n│   │   ├── CorsConfig.java\n│   │   └── SchedulerConfig.java\n│   ├── model/\n│   │   ├── Subscription.java\n│   │   ├── SubscriptionPriceChange.java\n│   │   ├── ProductPriceChange.java\n│   │   ├── Product.java\n│   │   ├── NotificationLog.java\n│   │   └── enums/\n│   ├── repository/\n│   ├── service/\n│   ├── controller/\n│   └── dto/\n├── src/main/resources/\n│   └── application.yml\n├── Dockerfile\n├── docker-compose.yml\n└── pom.xml\n```"
      }
      // Add all other sections here...
    ];

    const markdown = generateMarkdownDoc("Guía de Migración a Java/Spring Boot", sections);
    downloadMarkdown(markdown, "java-migration-guide");
  };

  const handleCopyAll = async () => {
    const content = document.getElementById('doc-content')?.innerText || '';
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Hidden on print */}
      <div className="print:hidden sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-bold">Guía de Migración a Java/Spring Boot</h1>
              <p className="text-sm text-muted-foreground">Edge Functions → Spring Boot Backend</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyAll}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copiar
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadMarkdown}>
              <Download className="h-4 w-4 mr-2" />
              Markdown
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div id="doc-content" className="container mx-auto px-4 py-8 max-w-5xl">
        <Card className="border-border/50">
          <CardContent className="p-8 print:p-0">
            {/* Introduction */}
            <DocumentSection title="Guía de Migración: Edge Functions a Java/Spring Boot" level={1}>
              <p className="text-muted-foreground">
                Esta guía documenta la migración completa de las Edge Functions de Deno/TypeScript a un backend Java con Spring Boot, 
                incluyendo toda la lógica de negocio, acceso a datos y programación de tareas.
              </p>
              <div className="bg-muted/50 border border-border rounded-lg p-4 mt-4">
                <h4 className="font-semibold mb-2">Requisitos Previos</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Java 17 o superior</li>
                  <li>Maven 3.8+</li>
                  <li>PostgreSQL 14+</li>
                  <li>Docker (opcional para deployment)</li>
                </ul>
              </div>
            </DocumentSection>

            {/* Project Structure */}
            <DocumentSection title="1. Estructura del Proyecto">
              <p className="text-muted-foreground mb-4">
                Organización recomendada para el proyecto Spring Boot:
              </p>
              <CodeBlock 
                language="text"
                code={`subscription-manager/
├── src/main/java/com/subscriptions/
│   ├── SubscriptionManagerApplication.java
│   ├── config/
│   │   ├── CorsConfig.java
│   │   └── SchedulerConfig.java
│   ├── model/
│   │   ├── Subscription.java
│   │   ├── SubscriptionPriceChange.java
│   │   ├── ProductPriceChange.java
│   │   ├── Product.java
│   │   ├── NotificationLog.java
│   │   └── enums/
│   │       ├── SubscriptionStatus.java
│   │       ├── ClientApprovalStatus.java
│   │       ├── ChangeType.java
│   │       └── ApplicationType.java
│   ├── repository/
│   │   ├── SubscriptionRepository.java
│   │   ├── SubscriptionPriceChangeRepository.java
│   │   ├── ProductPriceChangeRepository.java
│   │   ├── ProductRepository.java
│   │   └── NotificationLogRepository.java
│   ├── service/
│   │   ├── PriceChangeSchedulerService.java
│   │   └── ProductPriceChangeService.java
│   ├── controller/
│   │   └── PriceChangeController.java
│   ├── dto/
│   │   ├── ApplyPriceChangeRequest.java
│   │   ├── ApplyProductPriceChangeResponse.java
│   │   └── PriceChangeResult.java
│   └── scheduler/
│       └── PriceChangeScheduledTasks.java
├── src/main/resources/
│   └── application.yml
├── Dockerfile
├── docker-compose.yml
└── pom.xml`}
              />
            </DocumentSection>

            {/* Dependencies */}
            <DocumentSection title="2. Dependencias Maven">
              <p className="text-muted-foreground mb-4">
                Configuración completa del archivo <code className="text-xs bg-muted px-1 py-0.5 rounded">pom.xml</code>:
              </p>
              <CodeBlock 
                filename="pom.xml"
                language="xml"
                code={`<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>
    
    <groupId>com.subscriptions</groupId>
    <artifactId>subscription-manager</artifactId>
    <version>1.0.0</version>
    <name>Subscription Manager Backend</name>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`}
              />
            </DocumentSection>

            {/* Configuration */}
            <DocumentSection title="3. Configuración">
              <CodeBlock 
                filename="src/main/resources/application.yml"
                language="yaml"
                code={`spring:
  application:
    name: subscription-manager
  datasource:
    url: \${DATABASE_URL:jdbc:postgresql://localhost:5432/subscriptions}
    username: \${DATABASE_USER:postgres}
    password: \${DATABASE_PASSWORD:postgres}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true

server:
  port: \${PORT:8080}

app:
  scheduler:
    cron: "0 0 2 * * ?" # 2 AM daily
  price-change:
    auto-approve-days: 7`}
              />

              <div className="mt-6">
                <h4 className="font-semibold mb-3">CORS Configuration</h4>
                <CodeBlock 
                  filename="src/main/java/com/subscriptions/config/CorsConfig.java"
                  language="java"
                  code={`package com.subscriptions.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("*")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*");
            }
        };
    }
}`}
                />
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Scheduler Configuration</h4>
                <CodeBlock 
                  filename="src/main/java/com/subscriptions/config/SchedulerConfig.java"
                  language="java"
                  code={`package com.subscriptions.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class SchedulerConfig {
}`}
                />
              </div>
            </DocumentSection>

            {/* Entities */}
            <DocumentSection title="4. Entidades JPA">
              <p className="text-muted-foreground mb-4">
                Modelos de datos mapeados a las tablas PostgreSQL:
              </p>
              
              <h4 className="font-semibold mb-3">Enums</h4>
              <CodeBlock 
                filename="src/main/java/com/subscriptions/model/enums/SubscriptionStatus.java"
                language="java"
                code={`package com.subscriptions.model.enums;

public enum SubscriptionStatus {
    ACTIVE, PAUSED, CANCELLED, EXPIRED, TRIAL
}`}
              />

              <div className="mt-4">
                <CodeBlock 
                  filename="src/main/java/com/subscriptions/model/enums/ClientApprovalStatus.java"
                  language="java"
                  code={`package com.subscriptions.model.enums;

public enum ClientApprovalStatus {
    PENDING, APPROVED, REJECTED, NOT_REQUIRED
}`}
                />
              </div>

              <div className="mt-4">
                <CodeBlock 
                  filename="src/main/java/com/subscriptions/model/enums/ChangeType.java"
                  language="java"
                  code={`package com.subscriptions.model.enums;

public enum ChangeType {
    UPGRADE, DOWNGRADE, INFLATION, CUSTOM
}`}
                />
              </div>

              <div className="mt-4">
                <CodeBlock 
                  filename="src/main/java/com/subscriptions/model/enums/ApplicationType.java"
                  language="java"
                  code={`package com.subscriptions.model.enums;

public enum ApplicationType {
    IMMEDIATE, NEXT_CYCLE, SCHEDULED
}`}
                />
              </div>

              <h4 className="font-semibold mb-3 mt-6">Subscription Entity</h4>
              <CodeBlock 
                filename="src/main/java/com/subscriptions/model/Subscription.java"
                language="java"
                code={`package com.subscriptions.model;

import com.subscriptions.model.enums.SubscriptionStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "subscriptions")
public class Subscription {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    
    @Column(nullable = false)
    private String reference;
    
    @Column(name = "client_name", nullable = false)
    private String clientName;
    
    @Column(name = "client_email", nullable = false)
    private String clientEmail;
    
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;
    
    @Column(nullable = false)
    private String concept;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status;
    
    @Column(name = "next_charge_date", nullable = false)
    private LocalDate nextChargeDate;
    
    @Column(name = "last_charge_date")
    private LocalDate lastChargeDate;
    
    @Column(name = "last_price_change_date")
    private LocalDate lastPriceChangeDate;
    
    @Column(name = "price_change_history_count")
    private Integer priceChangeHistoryCount = 0;
    
    @Column(name = "pending_price_change_id")
    private UUID pendingPriceChangeId;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}`}
              />

              <h4 className="font-semibold mb-3 mt-6">SubscriptionPriceChange Entity</h4>
              <CodeBlock 
                filename="src/main/java/com/subscriptions/model/SubscriptionPriceChange.java"
                language="java"
                code={`package com.subscriptions.model;

import com.subscriptions.model.enums.*;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "subscription_price_changes")
public class SubscriptionPriceChange {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id", nullable = false)
    private Subscription subscription;
    
    @Column(name = "old_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal oldAmount;
    
    @Column(name = "new_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal newAmount;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal difference;
    
    @Column(name = "percentage_change", precision = 5, scale = 2)
    private BigDecimal percentageChange;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "change_type", nullable = false)
    private ChangeType changeType;
    
    @Column(nullable = false)
    private String reason;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "application_type", nullable = false)
    private ApplicationType applicationType;
    
    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;
    
    @Column(nullable = false)
    private String status = "pending";
    
    @Column(name = "requires_client_approval")
    private Boolean requiresClientApproval = false;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "client_approval_status")
    private ClientApprovalStatus clientApprovalStatus;
    
    @Column(name = "approval_token")
    private String approvalToken;
    
    @Column(name = "applied_at")
    private LocalDateTime appliedAt;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}`}
              />
            </DocumentSection>

            {/* Repositories */}
            <DocumentSection title="5. Repositorios JPA">
              <CodeBlock 
                filename="src/main/java/com/subscriptions/repository/SubscriptionPriceChangeRepository.java"
                language="java"
                code={`package com.subscriptions.repository;

import com.subscriptions.model.SubscriptionPriceChange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface SubscriptionPriceChangeRepository extends JpaRepository<SubscriptionPriceChange, UUID> {
    
    @Query("""
        SELECT spc FROM SubscriptionPriceChange spc
        WHERE spc.status = 'pending'
        AND spc.scheduledDate <= :today
        AND (spc.requiresClientApproval = false 
             OR spc.clientApprovalStatus = 'APPROVED')
        """)
    List<SubscriptionPriceChange> findScheduledChangesReady(LocalDate today);
    
    @Query("""
        SELECT spc FROM SubscriptionPriceChange spc
        WHERE spc.status = 'pending'
        AND spc.requiresClientApproval = true
        AND spc.clientApprovalStatus = 'PENDING'
        AND spc.createdAt < :cutoffDate
        """)
    List<SubscriptionPriceChange> findExpiredPendingApprovals(LocalDateTime cutoffDate);
}`}
              />
            </DocumentSection>

            {/* Services */}
            <DocumentSection title="6. Servicios de Negocio">
              <h4 className="font-semibold mb-3">PriceChangeSchedulerService</h4>
              <p className="text-sm text-muted-foreground mb-3">Equivalente a <code className="text-xs bg-muted px-1 py-0.5 rounded">apply-price-changes/index.ts</code></p>
              <CodeBlock 
                filename="src/main/java/com/subscriptions/service/PriceChangeSchedulerService.java"
                language="java"
                code={`package com.subscriptions.service;

import com.subscriptions.model.*;
import com.subscriptions.model.enums.ClientApprovalStatus;
import com.subscriptions.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class PriceChangeSchedulerService {
    
    private final SubscriptionPriceChangeRepository priceChangeRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final NotificationLogRepository notificationLogRepository;
    
    @Value("\${app.price-change.auto-approve-days:7}")
    private int autoApproveDays;
    
    @Transactional
    public Map<String, Object> applyScheduledPriceChanges() {
        log.info("Starting scheduled price changes application");
        
        LocalDate today = LocalDate.now();
        List<SubscriptionPriceChange> readyChanges = 
            priceChangeRepository.findScheduledChangesReady(today);
        
        List<UUID> appliedIds = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        
        for (SubscriptionPriceChange change : readyChanges) {
            try {
                applyPriceChange(change);
                appliedIds.add(change.getId());
            } catch (Exception e) {
                log.error("Error applying price change {}: {}", change.getId(), e.getMessage());
                errors.add(e.getMessage());
            }
        }
        
        // Auto-approve expired pending approvals
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(autoApproveDays);
        List<SubscriptionPriceChange> expiredPending = 
            priceChangeRepository.findExpiredPendingApprovals(cutoffDate);
        
        List<UUID> autoApprovedIds = new ArrayList<>();
        for (SubscriptionPriceChange change : expiredPending) {
            try {
                change.setClientApprovalStatus(ClientApprovalStatus.APPROVED);
                priceChangeRepository.save(change);
                
                applyPriceChange(change);
                autoApprovedIds.add(change.getId());
            } catch (Exception e) {
                log.error("Error auto-approving {}: {}", change.getId(), e.getMessage());
                errors.add(e.getMessage());
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("appliedChanges", appliedIds.size());
        result.put("autoApprovedChanges", autoApprovedIds.size());
        result.put("errors", errors);
        
        log.info("Completed: {} applied, {} auto-approved", 
                 appliedIds.size(), autoApprovedIds.size());
        
        return result;
    }
    
    private void applyPriceChange(SubscriptionPriceChange change) {
        Subscription subscription = change.getSubscription();
        
        subscription.setAmount(change.getNewAmount());
        subscription.setLastPriceChangeDate(LocalDate.now());
        subscription.setPriceChangeHistoryCount(
            (subscription.getPriceChangeHistoryCount() != null 
                ? subscription.getPriceChangeHistoryCount() : 0) + 1
        );
        
        subscriptionRepository.save(subscription);
        
        change.setStatus("applied");
        change.setAppliedAt(LocalDateTime.now());
        priceChangeRepository.save(change);
        
        // Create notification log
        NotificationLog notification = new NotificationLog();
        notification.setSubscriptionId(subscription.getId());
        notification.setEvent("price_change_applied");
        notification.setChannel("whatsapp");
        notification.setPhoneNumber(subscription.getPhoneNumber());
        notification.setMessage(String.format(
            "Tu suscripción %s cambió de $%.2f a $%.2f",
            subscription.getConcept(),
            change.getOldAmount(),
            change.getNewAmount()
        ));
        notification.setStatus("pending");
        notificationLogRepository.save(notification);
    }
}`}
              />
            </DocumentSection>

            {/* Controllers */}
            <DocumentSection title="7. Controladores REST">
              <CodeBlock 
                filename="src/main/java/com/subscriptions/controller/PriceChangeController.java"
                language="java"
                code={`package com.subscriptions.controller;

import com.subscriptions.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/functions/v1")
@RequiredArgsConstructor
public class PriceChangeController {
    
    private final PriceChangeSchedulerService schedulerService;
    private final ProductPriceChangeService productPriceChangeService;
    
    @PostMapping("/apply-price-changes")
    public ResponseEntity<Map<String, Object>> applyPriceChanges() {
        Map<String, Object> result = schedulerService.applyScheduledPriceChanges();
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/apply-product-price-change")
    public ResponseEntity<Map<String, Object>> applyProductPriceChange(
            @RequestBody Map<String, String> request) {
        String productPriceChangeId = request.get("product_price_change_id");
        Map<String, Object> result = 
            productPriceChangeService.applyProductPriceChange(productPriceChangeId);
        return ResponseEntity.ok(result);
    }
}`}
              />
            </DocumentSection>

            {/* Scheduled Tasks */}
            <DocumentSection title="8. Tareas Programadas">
              <p className="text-muted-foreground mb-4">
                Reemplazo de pg_cron usando Spring @Scheduled:
              </p>
              <CodeBlock 
                filename="src/main/java/com/subscriptions/scheduler/PriceChangeScheduledTasks.java"
                language="java"
                code={`package com.subscriptions.scheduler;

import com.subscriptions.service.PriceChangeSchedulerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PriceChangeScheduledTasks {
    
    private final PriceChangeSchedulerService schedulerService;
    
    // Runs daily at 2 AM
    @Scheduled(cron = "\${app.scheduler.cron:0 0 2 * * ?}")
    public void applyScheduledPriceChanges() {
        log.info("Executing scheduled price changes task");
        schedulerService.applyScheduledPriceChanges();
    }
}`}
              />
            </DocumentSection>

            {/* Deployment */}
            <DocumentSection title="9. Despliegue con Docker">
              <CodeBlock 
                filename="Dockerfile"
                language="dockerfile"
                code={`FROM eclipse-temurin:17-jdk-alpine as build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]`}
              />

              <div className="mt-4">
                <CodeBlock 
                  filename="docker-compose.yml"
                  language="yaml"
                  code={`version: '3.8'
services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: subscriptions
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: jdbc:postgresql://postgres:5432/subscriptions
      DATABASE_USER: postgres
      DATABASE_PASSWORD: postgres
    depends_on:
      - postgres

volumes:
  postgres_data:`}
                />
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4 mt-4">
                <h4 className="font-semibold mb-2">Variables de Entorno Requeridas</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li><code className="text-xs bg-muted px-1 py-0.5 rounded">DATABASE_URL</code> - URL de conexión PostgreSQL</li>
                  <li><code className="text-xs bg-muted px-1 py-0.5 rounded">DATABASE_USER</code> - Usuario de base de datos</li>
                  <li><code className="text-xs bg-muted px-1 py-0.5 rounded">DATABASE_PASSWORD</code> - Contraseña de base de datos</li>
                  <li><code className="text-xs bg-muted px-1 py-0.5 rounded">PORT</code> - Puerto del servidor (default: 8080)</li>
                </ul>
              </div>
            </DocumentSection>

            {/* Equivalence Table */}
            <DocumentSection title="10. Tabla de Equivalencias">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold">TypeScript/Deno</th>
                      <th className="text-left p-3 font-semibold">Java/Spring Boot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">Deno.serve()</code></td>
                      <td className="p-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">@RestController + @RequestMapping</code></td>
                    </tr>
                    <tr>
                      <td className="p-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">createClient()</code></td>
                      <td className="p-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">JPA Repositories + @Service</code></td>
                    </tr>
                    <tr>
                      <td className="p-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">supabase.from().select()</code></td>
                      <td className="p-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">repository.findBy...()</code></td>
                    </tr>
                    <tr>
                      <td className="p-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">supabase.from().update()</code></td>
                      <td className="p-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">repository.save(entity)</code></td>
                    </tr>
                    <tr>
                      <td className="p-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">pg_cron</code></td>
                      <td className="p-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">@Scheduled + @EnableScheduling</code></td>
                    </tr>
                    <tr>
                      <td className="p-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">interface</code></td>
                      <td className="p-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">@Entity + @Data (Lombok)</code></td>
                    </tr>
                    <tr>
                      <td className="p-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">CORS headers</code></td>
                      <td className="p-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">WebMvcConfigurer + CorsRegistry</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </DocumentSection>

            {/* Migration Checklist */}
            <DocumentSection title="11. Checklist de Migración">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">□</span>
                  </div>
                  <span className="text-sm">Configurar base de datos PostgreSQL con las tablas existentes</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">□</span>
                  </div>
                  <span className="text-sm">Crear proyecto Spring Boot con estructura de directorios</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">□</span>
                  </div>
                  <span className="text-sm">Agregar dependencias Maven (pom.xml)</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">□</span>
                  </div>
                  <span className="text-sm">Implementar entidades JPA con todas las relaciones</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">□</span>
                  </div>
                  <span className="text-sm">Crear repositorios con queries personalizados</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">□</span>
                  </div>
                  <span className="text-sm">Migrar lógica de negocio a servicios Spring</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">□</span>
                  </div>
                  <span className="text-sm">Implementar controladores REST con endpoints equivalentes</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">□</span>
                  </div>
                  <span className="text-sm">Configurar tareas programadas (@Scheduled)</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">□</span>
                  </div>
                  <span className="text-sm">Configurar CORS y variables de entorno</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">□</span>
                  </div>
                  <span className="text-sm">Crear Dockerfile y docker-compose.yml</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">□</span>
                  </div>
                  <span className="text-sm">Probar endpoints con datos reales</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">□</span>
                  </div>
                  <span className="text-sm">Verificar ejecución de tareas programadas</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">□</span>
                  </div>
                  <span className="text-sm">Actualizar frontend para apuntar a nuevas URLs de API</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">□</span>
                  </div>
                  <span className="text-sm">Desplegar a producción y monitorear</span>
                </div>
              </div>
            </DocumentSection>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
              <p>Guía de Migración generada automáticamente</p>
              <p className="mt-1">Para más información, consulta la documentación de Spring Boot y Spring Data JPA</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:p-0 {
            padding: 0 !important;
          }
          
          .page-break-before {
            page-break-before: always;
          }
          
          pre {
            page-break-inside: avoid;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          
          table {
            page-break-inside: avoid;
          }
          
          h1, h2, h3, h4 {
            page-break-after: avoid;
          }
          
          section {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
