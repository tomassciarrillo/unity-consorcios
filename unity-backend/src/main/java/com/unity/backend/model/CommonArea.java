/*
package com.unity.backend.model;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "common_areas")
@Data
public class CommonArea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn( name = "building_id", nullable = false)
    private Building building;

}

*/

package com.unity.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "common_areas", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"building_id", "name"})
})
@Data
public class CommonArea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id", nullable = false)
    private Building building;
}