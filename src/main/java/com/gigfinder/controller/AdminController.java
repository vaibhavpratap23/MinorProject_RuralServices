package com.gigfinder.controller;

import com.gigfinder.model.User;
import com.gigfinder.model.Category;
import com.gigfinder.model.WorkerProfile;
import com.gigfinder.model.Document;
import com.gigfinder.model.enums.VerificationStatus;
import com.gigfinder.repository.JobRepository;
import com.gigfinder.repository.UserRepository;
import com.gigfinder.repository.WorkerProfileRepository;
import com.gigfinder.repository.CategoryRepository;
import com.gigfinder.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkerProfileRepository workerProfileRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private com.gigfinder.service.NotificationService notificationService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
            LocalDateTime thisMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);

            Map<String, Object> stats = new HashMap<>();

            // Job statistics
            stats.put("totalJobs", jobRepository.count());
            stats.put("jobsToday", jobRepository.countJobsPostedToday(today));
            stats.put("jobsThisMonth", jobRepository.countByCreatedAtBetween(thisMonth, LocalDateTime.now()));
            stats.put("completedJobs", jobRepository.countCompletedJobsBetween(thisMonth, LocalDateTime.now()));

            // User statistics
            stats.put("totalUsers", userRepository.count());
            stats.put("totalWorkers", workerProfileRepository.count());
            stats.put("verifiedWorkers", workerProfileRepository.findByVerificationStatus(
                    VerificationStatus.APPROVED).size());

            // Popular categories
            stats.put("mostPopularCategory", jobRepository.findMostPopularCategory());

            // Simple time-series stub for frontend charts
            stats.put("timeseries", List.of(
                    Map.of("date", "2025-08-01", "jobs", 5),
                    Map.of("date", "2025-08-02", "jobs", 7),
                    Map.of("date", "2025-08-03", "jobs", 4)
            ));

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<Map<String,Object>>> listJobs() {
        try {
            List<com.gigfinder.model.Job> jobs = jobRepository.findAll();
            List<Map<String,Object>> resp = jobs.stream().map(j -> {
                Map<String,Object> m = new HashMap<>();
                m.put("id", j.getId());
                m.put("title", j.getTitle());
                m.put("status", j.getStatus());
                m.put("clientName", j.getClient().getUser().getName());
                m.put("workerId", j.getWorker() != null ? j.getWorker().getId() : null);
                m.put("address", j.getAddress());
                m.put("scheduledAt", j.getScheduledAt());
                m.put("createdAt", j.getCreatedAt());
                return m;
            }).toList();
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(List.of());
        }
    }

    @GetMapping("/workers/verified")
    public ResponseEntity<List<Map<String,Object>>> listVerifiedWorkers() {
        try {
            List<WorkerProfile> workers = workerProfileRepository.findByVerificationStatus(VerificationStatus.VERIFIED);
            List<Map<String,Object>> resp = workers.stream().map(w -> {
                Map<String,Object> m = new HashMap<>();
                m.put("id", w.getId());
                m.put("userId", w.getUser().getId());
                m.put("name", w.getUser().getName());
                m.put("phone", w.getUser().getPhone());
                return m;
            }).toList();
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(List.of());
        }
    }

    @Autowired
    private com.gigfinder.repository.JobAssignmentRepository jobAssignmentRepository;

    @PostMapping("/jobs/{jobId}/reassign")
    public ResponseEntity<?> reassignJob(@PathVariable Long jobId, @RequestBody Map<String, Long> body) {
        try {
            Long workerProfileId = body.get("workerProfileId");
            if (workerProfileId == null) return ResponseEntity.badRequest().body(Map.of("error","workerProfileId required"));

            com.gigfinder.model.Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
            WorkerProfile newWorker = workerProfileRepository.findById(workerProfileId).orElseThrow(() -> new RuntimeException("Worker not found"));

            // Update or create assignment
            java.util.Optional<com.gigfinder.model.JobAssignment> existing = jobAssignmentRepository.findByJob(job);
            if (existing.isPresent()) {
                com.gigfinder.model.JobAssignment a = existing.get();
                a.setWorker(newWorker);
                jobAssignmentRepository.save(a);
            } else {
                com.gigfinder.model.JobAssignment a = com.gigfinder.model.JobAssignment.builder()
                        .job(job)
                        .worker(newWorker)
                        .status(com.gigfinder.model.enums.AssignmentStatus.ASSIGNED)
                        .build();
                jobAssignmentRepository.save(a);
            }

            job.setWorker(newWorker.getUser());
            if (job.getStatus() == com.gigfinder.model.enums.JobStatus.OPEN) {
                job.setStatus(com.gigfinder.model.enums.JobStatus.ASSIGNED);
            }
            jobRepository.save(job);

            notificationService.sendJobAccepted(job.getClient().getUser().getId(), jobId, newWorker.getUser().getName());
            return ResponseEntity.ok(Map.of("message","Job reassigned"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/jobs/heatmap")
    public ResponseEntity<List<Map<String, Object>>> getJobHeatmap() {
        try {
            List<Map<String, Object>> heatmapData = List.of(
                    new HashMap<>(Map.of("lat", 28.6139, "lng", 77.2090, "count", 15)), // Delhi
                    new HashMap<>(Map.of("lat", 19.0760, "lng", 72.8777, "count", 12)), // Mumbai
                    new HashMap<>(Map.of("lat", 12.9716, "lng", 77.5946, "count", 8))   // Bangalore
            );
            return ResponseEntity.ok(heatmapData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/workers/leaderboard")
    public ResponseEntity<List<WorkerProfile>> getWorkerLeaderboard() {
        try {
            List<WorkerProfile> topWorkers = workerProfileRepository.findTop10ByOrderByRatingAvgDesc();
            return ResponseEntity.ok(topWorkers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> listUsers() {
        try {
            List<User> users = userRepository.findAll();
            List<Map<String, Object>> response = users.stream().map(u -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", u.getId());
                m.put("name", u.getName());
                m.put("email", u.getEmail());
                m.put("phone", u.getPhone());
                m.put("role", u.getRole());
                return m;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(List.of());
        }
    }

    @PostMapping("/users/{userId}/ban")
    public ResponseEntity<?> banUser(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setBanned(true);
            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User banned successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to ban user: " + e.getMessage());
        }
    }

    @PostMapping("/users/{userId}/unban")
    public ResponseEntity<?> unbanUser(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setBanned(false);
            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User unbanned successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to unban user: " + e.getMessage());
        }
    }

    @GetMapping("/fraud/reports")
    public ResponseEntity<List<Map<String, Object>>> getFraudReports() {
        try {
            List<Map<String, Object>> reports = List.of(
                    new HashMap<>(Map.of(
                            "id", 1,
                            "reportedUser", "user@example.com",
                            "reason", "Fake job posting",
                            "status", "PENDING",
                            "createdAt", LocalDateTime.now().minusDays(1)
                    ))
            );
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/workers/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingWorkers() {
        try {
            List<WorkerProfile> pendingWorkers = workerProfileRepository.findByVerificationStatusIn(
                    List.of(VerificationStatus.PENDING_BASIC, VerificationStatus.PENDING_FULL));

            List<Map<String, Object>> result = pendingWorkers.stream()
                    .map(worker -> {
                        Map<String, Object> workerData = new HashMap<>();
                        workerData.put("id", worker.getId());
                        workerData.put("name", worker.getUser().getName());
                        workerData.put("email", worker.getUser().getEmail());
                        workerData.put("phone", worker.getUser().getPhone());
                        workerData.put("verificationStatus", worker.getVerificationStatus());
                        workerData.put("aadhaarNumber", worker.getAadhaarNumber());
                        workerData.put("panNumber", worker.getPanNumber());
                        workerData.put("address", worker.getAddress());

                        List<Document> documents = documentRepository.findByWorker(worker);
                        List<Map<String, Object>> docData = documents.stream()
                                .map(doc -> {
                                    Map<String, Object> map = new HashMap<>();
                                    map.put("id", doc.getId());
                                    map.put("type", doc.getType());
                                    map.put("fileUrl", doc.getFileUrl());
                                    map.put("verificationStatus", doc.getVerificationStatus());
                                    return map;
                                })
                                .collect(Collectors.toList());

                        workerData.put("documents", docData);

                        return workerData;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(List.of());
        }
    }

    @PostMapping("/workers/{workerId}/approve")
    public ResponseEntity<?> approveWorker(@PathVariable Long workerId) {
        try {
            WorkerProfile worker = workerProfileRepository.findById(workerId)
                    .orElseThrow(() -> new RuntimeException("Worker not found"));

            worker.setVerificationStatus(VerificationStatus.VERIFIED);
            workerProfileRepository.save(worker);

            List<Document> documents = documentRepository.findByWorker(worker);
            documents.forEach(doc -> {
                doc.setVerificationStatus(VerificationStatus.VERIFIED);
                documentRepository.save(doc);
            });

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Worker approved successfully");
            // TODO: send email here via NotificationService or Mailer; for now, emit websocket
            // This simplistic notification informs the user in-app
            // notificationService.sendJobNotification(worker.getUser().getId(), "WORKER_APPROVED", Map.of("message", "You are verified. Start exploring jobs."));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to approve worker: " + e.getMessage()));
        }
    }

    @PostMapping("/workers/{workerId}/reject")
    public ResponseEntity<?> rejectWorker(@PathVariable Long workerId, @RequestBody Map<String, String> request) {
        try {
            WorkerProfile worker = workerProfileRepository.findById(workerId)
                    .orElseThrow(() -> new RuntimeException("Worker not found"));

            worker.setVerificationStatus(VerificationStatus.REJECTED);
            workerProfileRepository.save(worker);

            String reason = request.get("reason");

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Worker rejected successfully");
            response.put("reason", reason);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to reject worker: " + e.getMessage()));
        }
    }

    // ===== Category management =====
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> listCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        Category c = new Category();
        c.setName(name);
        return ResponseEntity.ok(categoryRepository.save(c));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String name = body.get("name");
        Category c = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
        c.setName(name);
        return ResponseEntity.ok(categoryRepository.save(c));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Category deleted"));
    }
}
